const mysql = require("mysql2/promise");

async function testConnection() {
  try {
    console.log("🔌 Testing database connection...");

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "nest-rest-api",
    });

    console.log("✅ Connected to database successfully!");

    // Test query
    const [rows] = await connection.execute("SELECT 1 as test");
    console.log("✅ Test query successful:", rows);

    // Check if users table exists
    try {
      const [users] = await connection.execute(
        "SELECT COUNT(*) as count FROM users LIMIT 1"
      );
      console.log("✅ Users table exists with", users[0].count, "records");
    } catch (error) {
      console.log("❌ Users table error:", error.message);
    }

    await connection.end();
    console.log("🔚 Connection closed successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.error("Full error:", error);
  }
}

testConnection();
