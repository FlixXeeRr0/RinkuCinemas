import express from 'express';
import { Op } from 'sequelize';
import db from '../config/database.js';

const router = express.Router();

// Get all movements
router.get('/', async (req, res, next) => {
  try {
    const movements = await db.Movement.findAll({
      include: [
        {
          model: db.Employee,
          as: 'Employee',
          include: [
            { model: db.Role, as: 'Role' },
            { model: db.EmployeeType, as: 'EmployeeType' },
          ],
        },
        {
          model: db.Role,
          as: 'CoveringRole',
        },
      ],
      order: [['Date', 'DESC']],
    });

    return res.status(200).json(movements);
  } catch (error) {
    next(error);
  }
});

// Search movements by employee code or name
router.get('/search', async (req, res, next) => {
  try {
    const { query } = req.query;

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
        { model: db.Role, as: 'Role' },
        { model: db.EmployeeType, as: 'EmployeeType' },
      ],
      order: [['ID', 'ASC']],
    });

    return res.status(200).json(employees);
  } catch (error) {
    next(error);
  }
});

// Get movement by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const movement = await db.Movement.findByPk(id, {
      include: [
        {
          model: db.Employee,
          as: 'Employee',
          include: [
            { model: db.Role, as: 'Role' },
            { model: db.EmployeeType, as: 'EmployeeType' },
          ],
        },
        {
          model: db.Role,
          as: 'CoveringRole',
        },
      ],
    });

    if (!movement) {
      return res.status(404).json({ message: 'Movimiento no encontrado' });
    }

    return res.status(200).json(movement);
  } catch (error) {
    next(error);
  }
});

// Check if movement exists for employee on specific date
router.post('/check-exists', async (req, res, next) => {
  try {
    const { EmployeeID, Date, excludeID } = req.body;

    const whereClause = {
      EmployeeID,
      Date,
    };

    if (excludeID) {
      whereClause.ID = { [Op.ne]: excludeID };
    }

    const existingMovement = await db.Movement.findOne({
      where: whereClause,
    });

    if (existingMovement) {
      return res.status(200).json({
        exists: true,
        movement: existingMovement,
        message: 'Ya existe un movimiento para este empleado en esta fecha',
      });
    }

    return res.status(200).json({ exists: false });
  } catch (error) {
    next(error);
  }
});

// Create new movement
router.post('/', async (req, res, next) => {
  try {
    const newMovement = await db.Movement.create(req.body);

    return res.status(200).json({
      message: 'Movimiento creado exitosamente',
      movement: newMovement,
    });
  } catch (error) {
    next(error);
  }
});

// Update movement
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ID, ...data } = req.body;

    const movement = await db.Movement.findByPk(id);

    if (!movement) {
      return res.status(404).json({ message: 'Movimiento no encontrado' });
    }

    await movement.update(data);

    return res.status(200).json({
      message: 'Movimiento actualizado exitosamente',
    });
  } catch (error) {
    next(error);
  }
});

// Delete movement
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const movement = await db.Movement.findByPk(id);

    if (!movement) {
      return res.status(404).json({ message: 'Movimiento no encontrado' });
    }

    await movement.destroy();

    return res.status(200).json({
      message: 'Movimiento eliminado exitosamente',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
