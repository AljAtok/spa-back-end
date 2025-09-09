const { execSync } = require("child_process");

try {
  console.log("🔄 Starting NestJS application...");

  // Try to compile and start the application
  const result = execSync("npm run build", {
    cwd: "d:\\Users\\node proj\\rest-api-nestjs",
    encoding: "utf8",
    timeout: 30000,
  });

  console.log("✅ Build successful!");
  console.log("Result:", result);
} catch (error) {
  console.error("❌ Build failed:");
  console.error("Error:", error.message);
  console.error("Stdout:", error.stdout);
  console.error("Stderr:", error.stderr);
}
