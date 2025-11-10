import employee from './controllers/employee.controller.js';

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
  app.use('/api/v1/employee', employee);

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
