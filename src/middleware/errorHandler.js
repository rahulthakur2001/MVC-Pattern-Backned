
const config = require("../config/env");
const logger = require("../config/logger");

const handleCastError = (err) => `Invalid ${err.path}: ${err.value}`;

const handleDuplicateFieldError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return `Duplicate value for field "${field}": "${err.keyValue[field]}". Please use another value.`;
};

const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((el) => el.message);
  return `Invalid input data: ${messages.join(". ")}`;
};

const sendDevError = (err, res) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendProdError = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
  logger.error("UNHANDLED ERROR 💥", { error: err });
  return res.status(500).json({
    success: false,
    message: "Something went wrong on our end. Please try again later.",
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  logger.error(`${req.method} ${req.originalUrl} - ${err.message}`, {
    statusCode: err.statusCode,
    stack: config.isProduction ? undefined : err.stack,
  });

  if (config.isProduction) {
    const error = {
      ...err,
      message: err.message,
      isOperational: err.isOperational,
    };

    if (err.name === "CastError") {
      error.message = handleCastError(err);
      error.statusCode = 400;
      error.isOperational = true;
    }
    if (err.code === 11000) {
      error.message = handleDuplicateFieldError(err);
      error.statusCode = 400;
      error.isOperational = true;
    }
    if (err.name === "ValidationError") {
      error.message = handleValidationError(err);
      error.statusCode = 400;
      error.isOperational = true;
    }
    if (err.name === "JsonWebTokenError") {
      error.message = "Invalid token. Please log in again.";
      error.statusCode = 401;
      error.isOperational = true;
    }
    if (err.name === "TokenExpiredError") {
      error.message = "Your session has expired. Please log in again.";
      error.statusCode = 401;
      error.isOperational = true;
    }

    return sendProdError(error, res);
  }

  return sendDevError(err, res);
};
