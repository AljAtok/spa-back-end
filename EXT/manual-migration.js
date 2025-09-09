// Manual migration script for refresh token fields
const mysql = require("mysql2/promise");
require("dotenv").config();

async function runMigration() {
  let connection;

  try {
    console.log("🔗 Connecting to database...");
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`Port: ${process.env.DB_PORT}`);
    console.log(`Database: ${process.env.DB_DATABASE}`);
    console.log(`Username: ${process.env.DB_USERNAME}`);

    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    console.log("✅ Connected to database successfully!");

    // Check if columns already exist
    console.log("🔍 Checking if refresh token columns already exist...");
    const [columns] = await connection.execute(
      `
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' 
      AND COLUMN_NAME IN ('refresh_token', 'refresh_token_expires_at')
    `,
      [process.env.DB_DATABASE]
    );

    const existingColumns = columns.map((row) => row.COLUMN_NAME);
    console.log("Existing columns:", existingColumns);

    // Add refresh_token column if it doesn't exist
    if (!existingColumns.includes("refresh_token")) {
      console.log("📝 Adding refresh_token column...");
      await connection.execute(`
        ALTER TABLE \`users\` 
        ADD COLUMN \`refresh_token\` TEXT NULL
      `);
      console.log("✅ refresh_token column added successfully");
    } else {
      console.log("ℹ️ refresh_token column already exists");
    }

    // Add refresh_token_expires_at column if it doesn't exist
    if (!existingColumns.includes("refresh_token_expires_at")) {
      console.log("📝 Adding refresh_token_expires_at column...");
      await connection.execute(`
        ALTER TABLE \`users\` 
        ADD COLUMN \`refresh_token_expires_at\` TIMESTAMP NULL
      `);
      console.log("✅ refresh_token_expires_at column added successfully");
    } else {
      console.log("ℹ️ refresh_token_expires_at column already exists");
    }

    // Verify the changes
    console.log("🔍 Verifying the migration...");
    const [finalColumns] = await connection.execute(
      `
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' 
      AND COLUMN_NAME IN ('refresh_token', 'refresh_token_expires_at')
      ORDER BY COLUMN_NAME
    `,
      [process.env.DB_DATABASE]
    );

    console.log("✅ Migration completed! New columns:");
    finalColumns.forEach((col) => {
      console.log(
        `  - ${col.COLUMN_NAME}: ${col.DATA_TYPE} (nullable: ${col.IS_NULLABLE})`
      );
    });

    // Record migration in migrations table (if it exists)
    try {
      console.log("📝 Recording migration in migrations table...");
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS \`migrations\` (
          \`id\` int NOT NULL AUTO_INCREMENT,
          \`timestamp\` bigint NOT NULL,
          \`name\` varchar(255) NOT NULL,
          PRIMARY KEY (\`id\`)
        )
      `);

      // Check if this migration is already recorded
      const [existingMigration] = await connection.execute(
        `
        SELECT * FROM \`migrations\` WHERE \`name\` = ?
      `,
        ["AddRefreshTokenToUser1703721600000"]
      );

      if (existingMigration.length === 0) {
        await connection.execute(
          `
          INSERT INTO \`migrations\` (\`timestamp\`, \`name\`) 
          VALUES (?, ?)
        `,
          [1703721600000, "AddRefreshTokenToUser1703721600000"]
        );
        console.log("✅ Migration recorded in migrations table");
      } else {
        console.log("ℹ️ Migration already recorded in migrations table");
      }
    } catch (migrationTableError) {
      console.log(
        "⚠️ Could not record migration in migrations table:",
        migrationTableError.message
      );
    }

    console.log("\n🎉 Refresh token migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);

    if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("\n🔧 Troubleshooting tips:");
      console.error("1. Check your database credentials in .env file");
      console.error(
        "2. Ensure MySQL server is running on port",
        process.env.DB_PORT
      );
      console.error("3. Verify the user has proper permissions");
      console.error(
        "4. Try connecting manually: mysql -h",
        process.env.DB_HOST,
        "-P",
        process.env.DB_PORT,
        "-u",
        process.env.DB_USERNAME,
        "-p"
      );
    }

    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log("🔌 Database connection closed");
    }
  }
}

// Run the migration
if (require.main === module) {
  runMigration().catch(console.error);
}

module.exports = { runMigration };
