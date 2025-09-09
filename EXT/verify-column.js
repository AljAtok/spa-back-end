// Verify current_access_key column exists
const mysql = require("mysql2/promise");
require("dotenv").config();

async function verifyColumn() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    console.log("✅ Connected to database");

    // Check if column exists
    const [columns] = await connection.execute(
      `
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'current_access_key'
    `,
      [process.env.DB_DATABASE]
    );

    if (columns.length > 0) {
      console.log("✅ current_access_key column found:");
      columns.forEach((col) => {
        console.log(
          `  ${col.COLUMN_NAME}: ${col.DATA_TYPE} (nullable: ${col.IS_NULLABLE})`
        );
      });
    } else {
      console.log("❌ current_access_key column not found");
    }

    // Check foreign key
    const [constraints] = await connection.execute(
      `
      SELECT CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'current_access_key'
      AND REFERENCED_TABLE_NAME IS NOT NULL
    `,
      [process.env.DB_DATABASE]
    );

    if (constraints.length > 0) {
      console.log("✅ Foreign key constraint found:");
      constraints.forEach((constraint) => {
        console.log(
          `  ${constraint.CONSTRAINT_NAME} -> ${constraint.REFERENCED_TABLE_NAME}.${constraint.REFERENCED_COLUMN_NAME}`
        );
      });
    } else {
      console.log("❌ Foreign key constraint not found");
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    if (connection) await connection.end();
  }
}

verifyColumn();
