const winston = require("winston");
require("winston-daily-rotate-file");
const path = require("path");
const config = require("./env");

const { combine, timestamp, printf, colorize, json } = winston.format;

const devFormat = combine(
  colorize(),
  timestamp({ format: "HH:mm:ss" }), 
  printf(({ level, message, timestamp: ts, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : "";
    return `[${ts}] ${level}: ${message} ${metaStr}`;
  }),
);

const prodFormat = combine(timestamp(), json());

const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: path.join(__dirname, "../../logs/app-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d", 
});

const errorFileRotateTransport = new winston.transports.DailyRotateFile({
  filename: path.join(__dirname, "../../logs/error-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  level: "error",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "30d",
});

const logger = winston.createLogger({
  level: config.logLevel,
  format: config.isProduction ? prodFormat : devFormat,
  transports: [
    new winston.transports.Console(),
    fileRotateTransport,
    errorFileRotateTransport,
  ],
  exitOnError: false,
});

module.exports = logger;
