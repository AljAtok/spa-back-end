const mysql = require("mysql2/promise");

async function createSessionsTable() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nest-rest-api",
  });

  try {
    console.log("🔄 Creating user_login_sessions table...");

    // Create the sessions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS user_login_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        refresh_token VARCHAR(255) NULL,
        refresh_token_expires_at TIMESTAMP NULL,
        last_login TIMESTAMP NULL,
        last_logout TIMESTAMP NULL,
        is_logout BOOLEAN DEFAULT FALSE,
        device_info VARCHAR(500) NULL,
        ip_address VARCHAR(45) NULL,
        user_agent TEXT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_refresh_token (refresh_token),
        INDEX idx_is_active (is_active),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log("✅ user_login_sessions table created successfully");
  } catch (error) {
    console.error("❌ Error creating table:", error.message);
  } finally {
    await connection.end();
  }
}

createSessionsTable();
