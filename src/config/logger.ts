import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, colorize, align } = format;

const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: combine(
    colorize({ all: true }), // Enable colors for console output
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console(), // Log to console
    // In a real application, you might add file transports,
    // or transports for external logging services like Sentry, Loggly, etc.
    // new transports.File({ filename: 'error.log', level: 'error' }),
    // new transports.File({ filename: 'combined.log' }),
  ],
  exceptionHandlers: [
    new transports.Console(),
    // new transports.File({ filename: 'exceptions.log' }),
  ],
  rejectionHandlers: [
    new transports.Console(),
    // new transports.File({ filename: 'rejections.log' }),
  ],
});

export default logger;
