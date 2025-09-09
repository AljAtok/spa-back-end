const mysql = require("mysql2/promise");

async function createSessionsTable() {
  console.log("🚀 Starting session table creation...");

  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nest-rest-api",
  });

  try {
    // Check if user_login_sessions table already exists
    console.log("🔍 Checking if user_login_sessions table exists...");
    try {
      await connection.execute("SELECT 1 FROM user_login_sessions LIMIT 1");
      console.log("✅ user_login_sessions table already exists!");
      return;
    } catch (error) {
      console.log("📝 user_login_sessions table does not exist, creating...");
    }

    // Create user_login_sessions table
    const createTableSQL = `
      CREATE TABLE user_login_sessions (
        id INT PRIMARY KEY AUTO_INCREMENT,
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
    `;

    await connection.execute(createTableSQL);
    console.log("✅ user_login_sessions table created successfully!");

    // Show current users table structure
    console.log("🔍 Current users table structure:");
    const [columns] = await connection.execute("SHOW COLUMNS FROM users");
    console.log("Users columns:", columns.map((col) => col.Field).join(", "));
  } catch (error) {
    console.error("❌ Error:", error.message);
    throw error;
  } finally {
    await connection.end();
    console.log("🔚 Database connection closed");
  }
}

createSessionsTable()
  .then(() => {
    console.log("🎉 Migration completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Migration failed:", error);
    process.exit(1);
  });
