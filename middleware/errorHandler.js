const errorHandler = (err, req, res, next) => {
    // Set default status code
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
    // Respond with an error message
    res.status(statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  };
  
  module.exports = { errorHandler };
  