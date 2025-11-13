import express from 'express';
import db from '../config/database.js';

const router = express.Router();

// Get all roles
router.get('/', async (_, res, next) => {
  try {
    const roles = await db.Role.findAll({
      order: [['ID', 'ASC']],
    });

    return res.status(200).json(roles);
  } catch (error) {
    next(error);
  }
});

// Get role by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const role = await db.Role.findByPk(id);

    if (!role) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }

    return res.status(200).json(role);
  } catch (error) {
    next(error);
  }
});

export default router;
