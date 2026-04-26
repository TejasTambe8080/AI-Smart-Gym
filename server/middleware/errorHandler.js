// Error Handler Middleware
const logger = require('../utils/logger');
const { errorResponse, validationErrorResponse } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  logger.error(`Unhandled error in ${req.method} ${req.path}`, {
    error: err.message,
    stack: err.stack
  });

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
    return validationErrorResponse(res, Object.values(details));
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    status = 409;
    message = 'Duplicate field value';
    const field = Object.keys(err.keyValue)[0];
    return errorResponse(res, `${field} already exists`, null, 409);
  }

  // Cast Errors (Invalid MongoDB ID)
  if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid ID format';
    return errorResponse(res, message, null, 400);
  }

  // Rate limit error
  if (err.status === 429) {
    return errorResponse(res, 'Too many requests. Please try again later.', null, 429);
  }

  // Return standardized error response
  return errorResponse(
    res, 
    message, 
    process.env.NODE_ENV === 'development' ? err : null, 
    status
  );
};

module.exports = errorHandler;

module.exports = errorHandler;
