const mysql = require("mysql2/promise");

async function checkSchema() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nest-rest-api",
  });

  console.log("Checking users table columns...");
  const [columns] = await connection.execute("SHOW COLUMNS FROM users");
  console.log(
    "Users table columns:",
    columns.map((col) => col.Field).join(", ")
  );

  console.log("\nChecking if user_login_sessions table exists...");
  try {
    const [sessions] = await connection.execute(
      "SHOW COLUMNS FROM user_login_sessions"
    );
    console.log(
      "user_login_sessions table columns:",
      sessions.map((col) => col.Field).join(", ")
    );
  } catch (error) {
    console.log("user_login_sessions table does not exist");
  }

  await connection.end();
}

checkSchema().catch(console.error);
