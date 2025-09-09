import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as cors from "cors";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/all-exceptions.filter";
import logger from "./config/logger";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // Configure CORS origins - handle multiple origins from env variable
  const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
    : ["*"];

  console.log("🌍 CORS Origins configured:", corsOrigins);

  // Enable CORS
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Check if the origin is in our allowed list or if we allow all origins
        if (corsOrigins.includes("*") || corsOrigins.includes(origin)) {
          console.log(`✅ CORS: Allowing origin: ${origin}`);
          return callback(null, true);
        }

        // Reject the request
        console.log(`❌ CORS: Rejecting origin: ${origin}`);
        return callback(
          new Error(`CORS policy violation: Origin ${origin} not allowed`),
          false
        );
      },
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "x-csrf-token",
        "X-CSRF-Token",
        "X-Requested-With",
        "Accept",
        "Accept-Version",
        "Accept-Language",
        "Accept-Encoding",
        "Content-Length",
        "Content-MD5",
        "Cache-Control",
        "cache-control",
        "Pragma",
        "pragma",
        "Date",
        "If-Modified-Since",
        "If-None-Match",
        "Range",
        "User-Agent",
      ],
      credentials: true,
      maxAge: 86400, // Cache preflight response for 24 hours
    })
  );
  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // API prefix
  //   app.setGlobalPrefix("api");

  // Serve static files from /uploads
  (app as NestExpressApplication).useStaticAssets(
    join(__dirname, "..", "uploads"),
    {
      prefix: "/uploads/",
    }
  );

  const port = configService.get<number>("port") || 3000;

  await app.listen(port);

  logger.info(`🚀 NestJS Application is running on: http://localhost:${port}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
}

bootstrap().catch((error) => {
  logger.error("❌ Error starting the application:", error);
  process.exit(1);
});
