const Router = (app) => {
  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "OK",
      message: "Rinku Cinemas API is running",
      timestamp: new Date().toISOString(),
    });
  });

  // Endpoints

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      error: "Endpoint not found",
      path: req.originalUrl,
      method: req.method,
    });
  });
};

export default Router;
