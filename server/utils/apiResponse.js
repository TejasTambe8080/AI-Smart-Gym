/**
 * Standardized API Response Utility
 * Ensures consistent response format across all endpoints
 */

const logger = require('./logger');

// ============================================
// RESPONSE FORMATS
// ============================================

/**
 * Success Response Format
 * {
 *   success: true,
 *   status: 200,
 *   message: "Operation successful",
 *   data: { ... },
 *   timestamp: "2026-04-24T..."
 * }
 */
const successResponse = (res, message, data = null, statusCode = 200) => {
  const response = {
    success: true,
    status: statusCode,
    message,
    timestamp: new Date().toISOString(),
    ...(data && { data })
  };

  logger.debug(`✅ Success: ${message}`, { statusCode });
  return res.status(statusCode).json(response);
};

/**
 * Error Response Format
 * {
 *   success: false,
 *   status: 400,
 *   message: "Error message",
 *   error: { ... },
 *   timestamp: "2026-04-24T..."
 * }
 */
const errorResponse = (res, message, error = null, statusCode = 500) => {
  const response = {
    success: false,
    status: statusCode,
    message,
    timestamp: new Date().toISOString(),
    ...(error && { error: process.env.NODE_ENV === 'development' ? error : undefined })
  };

  logger.error(`❌ Error: ${message}`, { statusCode, error });
  return res.status(statusCode).json(response);
};

/**
 * Validation Error Response
 */
const validationErrorResponse = (res, errors) => {
  const response = {
    success: false,
    status: 400,
    message: 'Validation failed',
    timestamp: new Date().toISOString(),
    errors: Array.isArray(errors) ? errors : [errors]
  };

  logger.warn(`⚠️ Validation error`, { errors });
  return res.status(400).json(response);
};

/**
 * Created Response
 */
const createdResponse = (res, message, data) => {
  return successResponse(res, message, data, 201);
};

/**
 * No Content Response
 */
const noContentResponse = (res, message = 'Operation successful') => {
  const response = {
    success: true,
    status: 204,
    message,
    timestamp: new Date().toISOString()
  };
  logger.debug(`✅ ${message}`);
  return res.status(204).json(response);
};

/**
 * Paginated Response
 */
const paginatedResponse = (res, message, data, pagination) => {
  const response = {
    success: true,
    status: 200,
    message,
    timestamp: new Date().toISOString(),
    data,
    pagination: {
      total: pagination.total,
      limit: pagination.limit,
      skip: pagination.skip,
      pages: Math.ceil(pagination.total / pagination.limit),
      currentPage: Math.floor(pagination.skip / pagination.limit) + 1
    }
  };

  logger.debug(`✅ Paginated response: ${message}`, { 
    total: pagination.total,
    page: Math.floor(pagination.skip / pagination.limit) + 1
  });
  return res.status(200).json(response);
};

// ============================================
// ERROR HANDLING WRAPPER
// ============================================

/**
 * Async error handler wrapper
 * Usage: router.get('/endpoint', asyncHandler(async (req, res) => { ... }))
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    logger.error(`Unhandled error in ${req.method} ${req.path}`, {
      error: error.message,
      stack: error.stack,
      body: req.body
    });

    // Determine error type and respond
    if (error.name === 'ValidationError') {
      return validationErrorResponse(res, 
        Object.values(error.errors).map(e => e.message)
      );
    }

    if (error.name === 'CastError') {
      return errorResponse(res, 'Invalid ID format', null, 400);
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return errorResponse(res, `${field} already exists`, null, 409);
    }

    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Invalid token', null, 401);
    }

    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token expired', null, 401);
    }

    // Default error
    return errorResponse(res, error.message || 'Internal server error', null, 500);
  });
};

// ============================================
// COMMON RESPONSE PATTERNS
// ============================================

const responses = {
  // Success patterns
  created: (res, data, message = 'Resource created successfully') => 
    createdResponse(res, message, data),
  
  updated: (res, data, message = 'Resource updated successfully') => 
    successResponse(res, message, data),
  
  deleted: (res, message = 'Resource deleted successfully') => 
    successResponse(res, message),
  
  listed: (res, data, total, limit, skip, message = 'Resources retrieved successfully') =>
    paginatedResponse(res, message, data, { total, limit, skip }),
  
  fetched: (res, data, message = 'Resource retrieved successfully') =>
    successResponse(res, message, data),
  
  // Error patterns
  notFound: (res, resource = 'Resource') =>
    errorResponse(res, `${resource} not found`, null, 404),
  
  unauthorized: (res, message = 'Unauthorized access') =>
    errorResponse(res, message, null, 401),
  
  forbidden: (res, message = 'Access forbidden') =>
    errorResponse(res, message, null, 403),
  
  conflict: (res, message = 'Resource already exists') =>
    errorResponse(res, message, null, 409),
  
  serverError: (res, message = 'Internal server error') =>
    errorResponse(res, message, null, 500),
  
  badRequest: (res, message = 'Bad request') =>
    errorResponse(res, message, null, 400)
};

// ============================================
// REQUEST LOGGING MIDDLEWARE
// ============================================

const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  logger.info(`📝 ${req.method} ${req.path}`, {
    method: req.method,
    path: req.path,
    userId: req.userId || 'anonymous',
    ip: req.ip
  });

  // Intercept response
  const originalJson = res.json;
  res.json = function (data) {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;

    logger.info(`📤 ${req.method} ${req.path} [${statusCode}] ${duration}ms`, {
      method: req.method,
      path: req.path,
      status: statusCode,
      duration,
      userId: req.userId || 'anonymous'
    });

    return originalJson.call(this, data);
  };

  next();
};

// ============================================
// EXPORTS
// ============================================

module.exports = {
  successResponse,
  errorResponse,
  validationErrorResponse,
  createdResponse,
  noContentResponse,
  paginatedResponse,
  asyncHandler,
  requestLogger,
  responses
};
