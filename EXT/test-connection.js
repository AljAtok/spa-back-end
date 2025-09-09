const { DataSource } = require("typeorm");

// Import all entities
const { User } = require("./src/entities/User");
const { UserLoginSession } = require("./src/entities/UserLoginSession");

const dataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "nest-rest-api",
  entities: [User, UserLoginSession],
  synchronize: false,
  logging: false,
});

async function testConnection() {
  try {
    await dataSource.initialize();
    console.log("✅ Database connection successful");

    // Check if user_login_sessions table exists
    const queryRunner = dataSource.createQueryRunner();
    const hasTable = await queryRunner.hasTable("user_login_sessions");
    console.log("user_login_sessions table exists:", hasTable);

    await dataSource.destroy();
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
}

testConnection();
