const { spawn } = require("child_process");

console.log("🚀 Testing NestJS Application Startup...");

const startTime = Date.now();
let output = "";
let hasStarted = false;

const server = spawn("npm", ["start"], {
  cwd: "D:\\Users\\node proj\\rest-api-nestjs",
  shell: true,
});

// Capture output
server.stdout.on("data", (data) => {
  const text = data.toString();
  output += text;
  console.log(text);

  // Check if application started successfully
  if (text.includes("Nest application successfully started")) {
    hasStarted = true;
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n✅ SUCCESS! Application started in ${elapsed}s`);
    console.log("🎉 Multi-session authentication is ready to test!");

    // Kill the server after successful start
    setTimeout(() => {
      server.kill();
      process.exit(0);
    }, 2000);
  }
});

server.stderr.on("data", (data) => {
  const text = data.toString();
  output += text;
  console.error(text);

  // Check for specific errors
  if (text.includes("Entity metadata for User#loginSessions was not found")) {
    console.log("❌ Still getting UserLoginSession entity error");
    server.kill();
    process.exit(1);
  }
});

server.on("error", (error) => {
  console.error("❌ Failed to start server:", error);
  process.exit(1);
});

// Timeout after 30 seconds
setTimeout(() => {
  if (!hasStarted) {
    console.log("⏰ Timeout: Application did not start within 30 seconds");
    console.log("📝 Full output:");
    console.log(output);
    server.kill();
    process.exit(1);
  }
}, 30000);
