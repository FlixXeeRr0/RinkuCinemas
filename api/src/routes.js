import employeeController from './controllers/employee.controller.js';
import roleController from './controllers/role.controller.js';
import employeeTypeController from './controllers/employeeType.controller.js';

const Router = (app) => {
  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'OK',
      message: 'Rinku Cinemas API is running',
      timestamp: new Date().toISOString(),
    });
  });

  // Endpoints
  app.use('/api/v1/employee', employeeController);
  app.use('/api/v1/role', roleController);
  app.use('/api/v1/employee-type', employeeTypeController);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      error: 'Endpoint not found',
      path: req.originalUrl,
      method: req.method,
    });
  });
};

export default Router;
