import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
import logger from "../config/logger";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      message =
        typeof errorResponse === "string"
          ? errorResponse
          : (errorResponse as any).message || exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;

      // Map specific error types to HTTP status codes
      if (message.includes("not found") || message.includes("Not found")) {
        status = HttpStatus.NOT_FOUND;
      } else if (
        message.includes("already exists") ||
        message.includes("duplicate")
      ) {
        status = HttpStatus.CONFLICT;
      } else if (message.includes("Invalid") || message.includes("required")) {
        status = HttpStatus.BAD_REQUEST;
      } else if (
        message.includes("Unauthorized") ||
        message.includes("Invalid credentials")
      ) {
        status = HttpStatus.UNAUTHORIZED;
      }
    }

    // Log the error
    logger.error(`${request.method} ${request.url} - ${status} - ${message}`, {
      exception: exception instanceof Error ? exception.stack : exception,
      timestamp: new Date().toISOString(),
      url: request.url,
      method: request.method,
    });

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message,
    });
  }
}
