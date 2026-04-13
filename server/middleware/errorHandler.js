// Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';
  let details = {};

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Token expired';
  }

  // Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation error';
    details = Object.keys(err.errors).reduce((acc, key) => {
      acc[key] = err.errors[key].message;
      return acc;
    }, {});
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    status = 409;
    message = 'Duplicate field value';
    const field = Object.keys(err.keyValue)[0];
    details[field] = `${field} already exists`;
  }

  // Cast Errors (Invalid MongoDB ID)
  if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid ID format';
  }

  res.status(status).json({
    success: false,
    message,
    ...(Object.keys(details).length > 0 && { details }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
