const logger = (req, res, next) => {
  const accessKey = 'caVvNH'; // Required access key
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip;

  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip} - ACCESS_KEY: ${accessKey}`);
  next();
};

module.exports = logger;
