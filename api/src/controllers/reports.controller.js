import express from 'express';
import { Op } from 'sequelize';
import db from '../config/database.js';
import {
  DELIVERY_BONUS,
  FOOD_VOUCHERS_RATE,
  HOURLY_BASE_RATE,
  ISR_ADDITIONAL,
  ISR_BASE,
  ISR_THRESHOLD,
} from '../config/constants.js';
import EmployeeTypeEnum from '../enums/employeeTypeEnum.js';

const router = express.Router();

// Get available years for an employee
router.get('/years/:employeeId', async (req, res, next) => {
  const { employeeId } = req.params;

  const oldestMovement = await db.Movement.findOne({
    where: { EmployeeID: employeeId },
    order: [['Date', 'ASC']],
    attributes: ['Date'],
  });

  if (!oldestMovement) {
    return res.status(200).json([]);
  }

  const oldestYear = new Date(oldestMovement.Date).getFullYear();
  const currentYear = new Date().getFullYear();

  const years = [];
  for (let year = oldestYear; year <= currentYear; year++) {
    years.push(year);
  }

  return res.status(200).json(years);
});

// Calculate payroll for employee in specific month/year
router.get('/payroll/:employeeId', async (req, res, next) => {
  const { employeeId } = req.params;
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({ message: 'Month and year are required' });
  }

  // Get employee data
  const employee = await db.Employee.findByPk(employeeId, {
    include: [
      { model: db.Role, as: 'Role' },
      { model: db.EmployeeType, as: 'EmployeeType' },
    ],
  });

  if (!employee) {
    return res.status(404).json({ message: 'Employee not found' });
  }

  // Get movements for the specified month/year
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const movements = await db.Movement.findAll({
    where: {
      EmployeeID: employeeId,
      Date: {
        [Op.between]: [startDate, endDate],
      },
    },
    include: [{ model: db.Role, as: 'CoveringRole' }],
    order: [['Date', 'ASC']],
  });

  if (movements.length === 0) {
    return res.status(404).json({
      message: 'No movements found for this period',
    });
  }

  // Calculate payroll for each movement
  const movementDetails = movements.map((movement) => {
    const hoursWorked = parseFloat(movement.HoursWorked);
    const deliveriesCount = parseInt(movement.DeliveriesCount);

    // Determine which role bonus applies
    let roleBonus = parseFloat(employee.Role.HourlyBonus);
    let roleName = employee.Role.Name;

    if (movement.CoveringRoleID) {
      roleBonus = parseFloat(movement.CoveringRole.HourlyBonus);
      roleName = movement.CoveringRole.Name;
    }

    const baseSalary = hoursWorked * HOURLY_BASE_RATE;
    const roleBonusTotal = hoursWorked * roleBonus;
    const deliveryBonusTotal = deliveriesCount * DELIVERY_BONUS;

    return {
      ID: movement.ID,
      Date: movement.Date,
      HoursWorked: hoursWorked,
      DeliveriesCount: deliveriesCount,
      HourlyBonus: roleBonus,
      BaseSalary: baseSalary,
      RoleBonus: roleBonusTotal,
      DeliveryBonus: deliveryBonusTotal,
      RoleName: roleName,
    };
  });

  // Calculate totals
  const { totalBaseSalary, totalRoleBonus, totalDeliveryBonus } =
    movementDetails.reduce(
      (sum, movement) => {
        sum.totalBaseSalary += movement.BaseSalary;
        sum.totalRoleBonus += movement.RoleBonus;
        sum.totalDeliveryBonus += movement.DeliveryBonus;

        return sum;
      },
      {
        totalBaseSalary: 0,
        totalRoleBonus: 0,
        totalDeliveryBonus: 0,
      }
    );

  const totalSalary = totalBaseSalary + totalRoleBonus + totalDeliveryBonus;
  // Food vouchers only for internal employees
  const isInternal = employee.EmployeeType.Name === EmployeeTypeEnum.INTERN;
  const foodVouchers = isInternal ? totalSalary * FOOD_VOUCHERS_RATE : 0;

  const grossSalary =
    totalBaseSalary + totalRoleBonus + totalDeliveryBonus + foodVouchers;

  // Calculate deductions
  const isrBase = grossSalary * ISR_BASE;
  const isrAdditional =
    grossSalary > ISR_THRESHOLD ? grossSalary * ISR_ADDITIONAL : 0;

  const netSalary = grossSalary - isrBase - isrAdditional;

  return res.status(200).json({
    employee: {
      ID: employee.ID,
      EmployeeCode: employee.EmployeeCode,
      FullName: employee.FullName,
      Role: employee.Role.Name,
      EmployeeType: employee.EmployeeType.Name,
    },
    period: {
      month: parseInt(month),
      year: parseInt(year),
    },
    movements: movementDetails,
    totals: {
      totalBaseSalary: parseFloat(totalBaseSalary.toFixed(2)),
      totalRoleBonus: parseFloat(totalRoleBonus.toFixed(2)),
      totalDeliveryBonus: parseFloat(totalDeliveryBonus.toFixed(2)),
      grossSalary: parseFloat(grossSalary.toFixed(2)),
      isrBase: parseFloat(isrBase.toFixed(2)),
      isrAdditional: parseFloat(isrAdditional.toFixed(2)),
      foodVouchers: parseFloat(foodVouchers.toFixed(2)),
      netSalary: parseFloat(netSalary.toFixed(2)),
    },
  });
});

export default router;
