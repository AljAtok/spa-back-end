const { spawn } = require("child_process");

console.log("🚀 Starting NestJS application...");

const server = spawn("npm", ["start"], {
  cwd: "d:\\Users\\node proj\\rest-api-nestjs",
  stdio: "inherit",
  shell: true,
});

server.on("error", (error) => {
  console.error("❌ Failed to start server:", error);
});

server.on("close", (code) => {
  console.log(`Server process exited with code ${code}`);
});

// Keep the script running
process.on("SIGINT", () => {
  console.log("\n🛑 Stopping server...");
  server.kill();
  process.exit(0);
});
