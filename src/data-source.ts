import { DataSource } from "typeorm";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env file
// Make sure to specify the path to .env file
config({ path: resolve(__dirname, "../.env") });

// Import configuration after loading env vars
import { migrationConfig } from "./database/database.config";

// Debug: Log the loaded configuration (remove in production)
console.log("🔍 Database Config Debug:");
console.log("Host:", process.env.DB_HOST);
console.log("Port:", process.env.DB_PORT);
console.log("Username:", process.env.DB_USERNAME);
console.log(
  "Password:",
  process.env.DB_PASSWORD ? "***LOADED***" : "❌ NOT LOADED"
);
console.log("Database:", process.env.DB_DATABASE);

// Create and export the DataSource for TypeORM CLI
export const AppDataSource = new DataSource(migrationConfig);

// Initialize the data source (optional, useful for debugging)
if (require.main === module) {
  AppDataSource.initialize()
    .then(() => {
      console.log(
        "✅ Data Source has been initialized successfully for migrations"
      );
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Error during Data Source initialization:", error);
      process.exit(1);
    });
}
