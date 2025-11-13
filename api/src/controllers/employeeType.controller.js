import express from 'express';
import db from '../config/database.js';

const router = express.Router();

// Get all employee types
router.get('/', async (_, res, next) => {
  try {
    const employeeTypes = await db.EmployeeType.findAll({
      order: [['ID', 'ASC']],
    });

    return res.status(200).json(employeeTypes);
  } catch (error) {
    next(error);
  }
});

// Get employee type by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const employeeType = await db.EmployeeType.findByPk(id);

    if (!employeeType) {
      return res
        .status(404)
        .json({ message: 'Tipo de empleado no encontrado' });
    }

    return res.status(200).json(employeeType);
  } catch (error) {
    next(error);
  }
});

export default router;
