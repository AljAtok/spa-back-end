// Manual migration script for current_access_key field
const mysql = require("mysql2/promise");
require("dotenv").config();

async function runCurrentAccessKeyMigration() {
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

    // Check if column already exists
    console.log("🔍 Checking if current_access_key column already exists...");
    const [columns] = await connection.execute(
      `
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'current_access_key'
    `,
      [process.env.DB_DATABASE]
    );

    if (columns.length === 0) {
      console.log("📝 Adding current_access_key column...");

      // Add current_access_key column with foreign key constraint
      await connection.execute(`
        ALTER TABLE \`users\` 
        ADD COLUMN \`current_access_key\` INT NULL
      `);

      console.log("✅ current_access_key column added successfully");

      // Add foreign key constraint
      console.log("📝 Adding foreign key constraint...");
      await connection.execute(`
        ALTER TABLE \`users\` 
        ADD CONSTRAINT \`FK_users_current_access_key\` 
        FOREIGN KEY (\`current_access_key\`) 
        REFERENCES \`access_key\`(\`id\`) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE
      `);

      console.log("✅ Foreign key constraint added successfully");
    } else {
      console.log("ℹ️ current_access_key column already exists");
    }

    // Verify the changes
    console.log("🔍 Verifying the migration...");
    const [finalColumns] = await connection.execute(
      `
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'current_access_key'
    `,
      [process.env.DB_DATABASE]
    );

    if (finalColumns.length > 0) {
      const col = finalColumns[0];
      console.log("✅ Migration completed! New column:");
      console.log(
        `  - ${col.COLUMN_NAME}: ${col.DATA_TYPE} (nullable: ${col.IS_NULLABLE}, default: ${col.COLUMN_DEFAULT})`
      );
    }

    // Check foreign key constraint
    const [constraints] = await connection.execute(
      `
      SELECT 
        CONSTRAINT_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'current_access_key'
      AND REFERENCED_TABLE_NAME IS NOT NULL
    `,
      [process.env.DB_DATABASE]
    );

    if (constraints.length > 0) {
      console.log("✅ Foreign key constraint verified:");
      constraints.forEach((constraint) => {
        console.log(
          `  - ${constraint.CONSTRAINT_NAME} -> ${constraint.REFERENCED_TABLE_NAME}.${constraint.REFERENCED_COLUMN_NAME}`
        );
      });
    }

    // Record migration in migrations table
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

      const migrationTimestamp = Date.now();
      const migrationName = "AddCurrentAccessKeyToUser" + migrationTimestamp;

      // Check if this migration is already recorded
      const [existingMigration] = await connection.execute(
        `
        SELECT * FROM \`migrations\` WHERE \`name\` LIKE ?
      `,
        ["AddCurrentAccessKeyToUser%"]
      );

      if (existingMigration.length === 0) {
        await connection.execute(
          `
          INSERT INTO \`migrations\` (\`timestamp\`, \`name\`) 
          VALUES (?, ?)
        `,
          [migrationTimestamp, migrationName]
        );
        console.log(`✅ Migration recorded: ${migrationName}`);
      } else {
        console.log("ℹ️ Migration already recorded in migrations table");
      }
    } catch (migrationTableError) {
      console.log(
        "⚠️ Could not record migration:",
        migrationTableError.message
      );
    }

    console.log("\n🎉 Current Access Key migration completed successfully!");
    console.log("");
    console.log("💡 Usage Tips:");
    console.log("1. Set a default access key for users:");
    console.log("   UPDATE users SET current_access_key = 1 WHERE id = 123;");
    console.log("");
    console.log("2. Query users with their current access key:");
    console.log("   SELECT u.*, ak.access_key_name FROM users u");
    console.log("   LEFT JOIN access_key ak ON u.current_access_key = ak.id;");
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
    } else if (error.code === "ER_DUP_KEYNAME") {
      console.error("\n⚠️ Foreign key constraint already exists");
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
  runCurrentAccessKeyMigration().catch(console.error);
}

module.exports = { runCurrentAccessKeyMigration };
