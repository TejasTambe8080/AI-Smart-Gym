// Logger Middleware
const logger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const method = req.method;
    const url = req.url;
    const status = res.statusCode;

    const statusColor =
      status >= 500
        ? '\x1b[31m' // red
        : status >= 400
        ? '\x1b[33m' // yellow
        : status >= 200
        ? '\x1b[32m' // green
        : '\x1b[36m'; // cyan

    const reset = '\x1b[0m';

    console.log(
      `${statusColor}[${method}] ${url} → ${status} ${reset}(${duration}ms)`
    );
  });

  next();
};

module.exports = logger;
