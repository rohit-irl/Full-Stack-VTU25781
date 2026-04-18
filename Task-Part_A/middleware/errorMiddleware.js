const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error',
    details: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = errorMiddleware;
