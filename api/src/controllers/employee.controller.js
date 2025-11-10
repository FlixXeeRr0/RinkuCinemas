import express from 'express';
import Employee from '../models/employee.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const employees = await Employee.findAll({
      where: {
        status: true,
      },
    });

    return res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

export default router;
