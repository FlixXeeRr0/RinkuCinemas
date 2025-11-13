import dotenv from 'dotenv';
import cors from 'cors';
import Express from 'express';
import Http from 'http';
import db from './config/database.js';
import Router from './routes.js';

// Load environment variables
dotenv.config();

const port = process.env.PORT || 5000;
const app = Express();

// Middlewares
app.use(cors());
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

Router(app);

const initializeDatabase = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Database connected successfully');

    await db.sequelize.sync({ alter: false });
    console.log('✅ Database synced');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

// initialize database before starting the server
initializeDatabase().then(() => {
  // Create HTTP server
  Http.createServer(app).listen(port, '0.0.0.0', () => {
    console.log(`🚀 Servicio iniciado`);
    console.log(`📍 http://localhost:${port}`);
  });
});

// Global error handling
app.use((err, req, res, next) => {
  res.status(500).json({
    error: 'Ups, Something went wrong...',
    message: err.message,
  });
});