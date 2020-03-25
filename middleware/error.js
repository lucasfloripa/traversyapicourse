const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  // Log to console for dev
  console.log(err);

  // Mongoose bad ObjectId handler
  if (error.name === "CastError") {
    error = new ErrorResponse(
      `Resourse not found with id of ${error.value}`,
      404
    );
  }

  // Mongoose duplicate key
  if (error.code === 11000) {
    error = new ErrorResponse(`Duplicate field value entered`, 400);
  }

  // Mongoose validation error
  if (error.name === "ValidationError") {
    const message = Object.values(error.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error"
  });
};

module.exports = errorHandler;
