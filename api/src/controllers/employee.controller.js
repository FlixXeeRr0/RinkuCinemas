import express from 'express';
import { Op } from 'sequelize';
import db from '../config/database.js';
import { generateEmployeeCode } from '../utils/functions.js';

const router = express.Router();

// Get all active employees with relations
router.get('/', async (req, res, next) => {
  try {
    const employees = await db.Employee.findAll({
      where: {
        Status: true,
      },
      include: [
        {
          model: db.Role,
          as: 'Role',
          attributes: ['ID', 'Name'],
        },
        {
          model: db.EmployeeType,
          as: 'EmployeeType',
          attributes: ['ID', 'Name'],
        },
      ],
      order: [['ID', 'ASC']],
    });

    return res.status(200).json(employees);
  } catch (error) {
    next(error);
  }
});

// Search employees by Code or Name (returns array)
router.get('/search', async (req, res, next) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    const employees = await db.Employee.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { EmployeeCode: { [Op.like]: `%${query}%` } },
              { FullName: { [Op.like]: `%${query}%` } },
            ],
          },
          { Status: true },
        ],
      },
      include: [
        {
          model: db.Role,
          as: 'Role',
          attributes: ['ID', 'Name'],
        },
        {
          model: db.EmployeeType,
          as: 'EmployeeType',
          attributes: ['ID', 'Name'],
        },
      ],
      order: [['ID', 'ASC']],
    });

    if (employees.length === 0) {
      return res.status(404).json({ message: 'No se encontraron empleados' });
    }

    return res.status(200).json(employees);
  } catch (error) {
    next(error);
  }
});

// Get employee by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const employee = await db.Employee.findOne({
      where: {
        ID: id,
        Status: true,
      },
      include: [
        {
          model: db.Role,
          as: 'Role',
          attributes: ['ID', 'Name'],
        },
        {
          model: db.EmployeeType,
          as: 'EmployeeType',
          attributes: ['ID', 'Name'],
        },
      ],
    });

    if (!employee) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    return res.status(200).json(employee);
  } catch (error) {
    next(error);
  }
});

// Check if employee code or name exists
router.post('/check-exists', async (req, res, next) => {
  try {
    const { EmployeeCode, FullName, excludeID } = req.body;
    
    const whereClause = {
      Status: true,
    };

    if (excludeID) {
      whereClause.ID = { [Op.ne]: excludeID };
    }

    const conditions = [];
    if (EmployeeCode) conditions.push({ EmployeeCode });
    if (FullName) conditions.push({ FullName });

    if (conditions.length === 0) return res.status(400).json();

    const existingEmployee = await db.Employee.findOne({
      where: {
        ...whereClause,
        [Op.or]: conditions,
      },
    });

    if (existingEmployee) {
      const field = existingEmployee.EmployeeCode === EmployeeCode 
        ? 'código de empleado' 
        : 'nombre';
      
      return res.status(200).json({ 
        exists: true,
        field,
        message: `Ya existe un empleado con ese ${field}` 
      });
    }

    return res.status(200).json({ exists: false });
  } catch (error) {
    next(error);
  }
});

// Create new employee
router.post('/', async (req, res, next) => {
  try {
    const lastEmployee = await db.Employee.findOne({
      order: [['EmployeeCode', 'DESC']],
      attributes: ['EmployeeCode'],
      raw: true,
    });
    const employeeCode = generateEmployeeCode(lastEmployee.EmployeeCode);

    const newEmployee = await db.Employee.create({
      ...req.body,
      EmployeeCode: employeeCode,
    });

    return res.status(201).json({
      message: 'Empleado creado exitosamente',
      employee: newEmployee,
      code: 200,
    });
  } catch (error) {
    next(error);
  }
});

// Update employee
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ID, EmployeeCode, ...data } = req.body;

    const employee = await db.Employee.findByPk(id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    await employee.update(data);

    return res.status(200).json({
      code: 200,
      message: 'Empleado actualizado exitosamente',
    });
  } catch (error) {
    next(error);
  }
});

// Delete employee (soft delete)
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const employee = await db.Employee.findByPk(id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Empleado no encontrado',
      });
    }

    await employee.update({ Status: false });

    return res.status(200).json({
      success: true,
      message: 'Empleado eliminado exitosamente',
    });
  } catch (error) {
    next(error);
  }
});

export default router;