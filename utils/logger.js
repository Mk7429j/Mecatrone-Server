// utils/logger.js
const winston = require("winston");

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ level, message, timestamp }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
);

// Create the logger instance
const logger = winston.createLogger({
  level: "info", // change to 'debug' or 'error' based on environment
  format: logFormat,
  transports: [
    new winston.transports.Console(), // logs to console
    new winston.transports.File({ filename: "logs/error.log", level: "error" }), // error logs
    new winston.transports.File({ filename: "logs/combined.log" }), // all logs
  ],
});

module.exports = logger;
