import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from 'sequelize';
import mysql from 'mysql2';
import initModels from '../models/init-models.js';

const env = process.env.NODE_ENV || 'development';
const isDev = env === 'development';

const sequelize = new Sequelize({
  dialect: 'mysql',
  dialectModule: mysql,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  timezone: '+00:00',
});

// Init models and associations
const db = { ...initModels(sequelize) };

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;


