const errorHandler = (error, req, res) => {
  const statusCode = error.statusCode || 500;

  console.error(error);

  return res.status(statusCode).json({
    message:
      statusCode === 500
        ? "An unexpected server error occurred"
        : error.message,
  });
};

module.exports = errorHandler;
