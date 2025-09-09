const mysql = require("mysql2/promise");
require("dotenv").config();

async function createUserLoginSessionsTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "nest_api",
  });

  try {
    console.log("🔄 Creating user_login_sessions table...");

    // Create user_login_sessions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS user_login_sessions (
        id int NOT NULL AUTO_INCREMENT,
        user_id int NOT NULL,
        refresh_token varchar(255) DEFAULT NULL,
        refresh_token_expires_at timestamp NULL DEFAULT NULL,
        last_login timestamp NULL DEFAULT NULL,
        last_logout timestamp NULL DEFAULT NULL,
        is_logout tinyint NOT NULL DEFAULT '0',
        device_info varchar(255) DEFAULT NULL,
        ip_address varchar(255) DEFAULT NULL,
        user_agent text,
        is_active tinyint NOT NULL DEFAULT '1',
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        modified_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY FK_user_login_sessions_user_id (user_id),
        CONSTRAINT FK_user_login_sessions_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);

    console.log("✅ user_login_sessions table created successfully");

    // Migrate existing refresh tokens to sessions
    console.log("🔄 Migrating existing refresh tokens to sessions...");

    const [users] = await connection.execute(`
      SELECT id, refresh_token, refresh_token_expires_at, last_login, last_logout, is_logout
      FROM users 
      WHERE refresh_token IS NOT NULL
    `);

    let migratedCount = 0;
    for (const user of users) {
      await connection.execute(
        `
        INSERT INTO user_login_sessions 
        (user_id, refresh_token, refresh_token_expires_at, last_login, last_logout, is_logout, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
        [
          user.id,
          user.refresh_token,
          user.refresh_token_expires_at,
          user.last_login,
          user.last_logout,
          user.is_logout,
          user.is_logout ? 0 : 1,
        ]
      );
      migratedCount++;
    }

    console.log(`✅ Migrated ${migratedCount} existing sessions`);

    // Remove session fields from users table
    console.log("🔄 Removing old session fields from users table...");

    try {
      await connection.execute("ALTER TABLE users DROP COLUMN last_login");
      console.log("✅ Dropped last_login column");
    } catch (error) {
      console.log("⚠️  last_login column might not exist:", error.message);
    }

    try {
      await connection.execute("ALTER TABLE users DROP COLUMN last_logout");
      console.log("✅ Dropped last_logout column");
    } catch (error) {
      console.log("⚠️  last_logout column might not exist:", error.message);
    }

    try {
      await connection.execute("ALTER TABLE users DROP COLUMN is_logout");
      console.log("✅ Dropped is_logout column");
    } catch (error) {
      console.log("⚠️  is_logout column might not exist:", error.message);
    }

    try {
      await connection.execute("ALTER TABLE users DROP COLUMN refresh_token");
      console.log("✅ Dropped refresh_token column");
    } catch (error) {
      console.log("⚠️  refresh_token column might not exist:", error.message);
    }

    try {
      await connection.execute(
        "ALTER TABLE users DROP COLUMN refresh_token_expires_at"
      );
      console.log("✅ Dropped refresh_token_expires_at column");
    } catch (error) {
      console.log(
        "⚠️  refresh_token_expires_at column might not exist:",
        error.message
      );
    }

    console.log("🎉 User login sessions migration completed successfully!");
    console.log("\n📋 Summary:");
    console.log("✅ Created user_login_sessions table");
    console.log(`✅ Migrated ${migratedCount} existing sessions`);
    console.log("✅ Cleaned up users table");
    console.log("\n🚀 Multi-session support is now active!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run the migration
createUserLoginSessionsTable().catch(console.error);
