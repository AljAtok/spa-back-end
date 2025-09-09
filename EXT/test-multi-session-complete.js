const axios = require("axios");

const BASE_URL = "http://localhost:3000";
const TEST_CREDENTIALS = {
  user_name: "june_doe",
  password: "test123",
};

let authTokens = [];
let refreshTokens = [];

async function makeRequest(method, endpoint, data = null, tokenIndex = 0) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {},
    };

    if (data) {
      config.data = data;
    }

    if (authTokens[tokenIndex]) {
      config.headers["Authorization"] = `Bearer ${authTokens[tokenIndex]}`;
    }

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      status: error.response?.status,
    };
  }
}

async function testMultiSessionLogin() {
  console.log("🔐 Testing Multiple Session Login...\n");

  // Test 1: First login session
  console.log("1️⃣ Creating first login session...");
  const session1 = await makeRequest("POST", "/auth/login", {
    ...TEST_CREDENTIALS,
    device_info: "Device 1 - Chrome Browser",
  });

  if (session1.success) {
    authTokens.push(session1.data.access_token);
    refreshTokens.push(session1.data.refresh_token);
    console.log("✅ First session created successfully");
    console.log(`   Session ID: ${session1.data.session.id}`);
    console.log(`   Device: ${session1.data.session.device_info}`);
  } else {
    console.log("❌ First session failed:", session1.error);
    return false;
  }

  // Test 2: Second login session (concurrent)
  console.log("\n2️⃣ Creating second concurrent session...");
  const session2 = await makeRequest("POST", "/auth/login", {
    ...TEST_CREDENTIALS,
    device_info: "Device 2 - Firefox Browser",
  });

  if (session2.success) {
    authTokens.push(session2.data.access_token);
    refreshTokens.push(session2.data.refresh_token);
    console.log("✅ Second session created successfully");
    console.log(`   Session ID: ${session2.data.session.id}`);
    console.log(`   Device: ${session2.data.session.device_info}`);
  } else {
    console.log("❌ Second session failed:", session2.error);
    return false;
  }

  // Test 3: Verify both sessions can access protected routes
  console.log("\n3️⃣ Testing concurrent session access...");

  const profile1 = await makeRequest("GET", "/auth/profile", null, 0);
  const profile2 = await makeRequest("GET", "/auth/profile", null, 1);

  if (profile1.success && profile2.success) {
    console.log("✅ Both sessions can access protected routes");
    console.log(`   Session 1 user: ${profile1.data.user_name}`);
    console.log(`   Session 2 user: ${profile2.data.user_name}`);
  } else {
    console.log("❌ Session access failed");
    if (!profile1.success) console.log("   Session 1 error:", profile1.error);
    if (!profile2.success) console.log("   Session 2 error:", profile2.error);
  }

  // Test 4: Get active sessions
  console.log("\n4️⃣ Getting active sessions...");
  const activeSessions = await makeRequest("GET", "/auth/sessions", null, 0);

  if (activeSessions.success) {
    console.log("✅ Active sessions retrieved");
    console.log(`   Total active sessions: ${activeSessions.data.length}`);
    activeSessions.data.forEach((session, index) => {
      console.log(
        `   Session ${index + 1}: ID ${session.id}, Device: ${session.device_info}`
      );
    });
  } else {
    console.log("❌ Failed to get active sessions:", activeSessions.error);
  }

  // Test 5: Refresh token test
  console.log("\n5️⃣ Testing refresh token for session 1...");
  const refreshResult = await makeRequest("POST", "/auth/refresh-token", {
    refresh_token: refreshTokens[0],
  });

  if (refreshResult.success) {
    console.log("✅ Refresh token successful");
    authTokens[0] = refreshResult.data.access_token;
    refreshTokens[0] = refreshResult.data.refresh_token;
    console.log(
      `   New access token received for session: ${refreshResult.data.session.id}`
    );
  } else {
    console.log("❌ Refresh token failed:", refreshResult.error);
  }

  // Test 6: Logout specific session
  console.log("\n6️⃣ Logging out session 1...");
  const logoutSession1 = await makeRequest("POST", "/auth/logout", null, 0);

  if (logoutSession1.success) {
    console.log("✅ Session 1 logged out successfully");

    // Test if session 1 can still access
    const testAccess1 = await makeRequest("GET", "/auth/profile", null, 0);
    if (!testAccess1.success) {
      console.log("✅ Session 1 correctly denied access after logout");
    } else {
      console.log("❌ Session 1 can still access (unexpected)");
    }

    // Test if session 2 still works
    const testAccess2 = await makeRequest("GET", "/auth/profile", null, 1);
    if (testAccess2.success) {
      console.log("✅ Session 2 still active after session 1 logout");
    } else {
      console.log("❌ Session 2 affected by session 1 logout (unexpected)");
    }
  } else {
    console.log("❌ Session 1 logout failed:", logoutSession1.error);
  }

  // Test 7: Logout all sessions
  console.log("\n7️⃣ Logging out all remaining sessions...");
  const logoutAll = await makeRequest("POST", "/auth/logout-all", null, 1);

  if (logoutAll.success) {
    console.log("✅ All sessions logged out successfully");

    // Test if session 2 can still access
    const testAccess2 = await makeRequest("GET", "/auth/profile", null, 1);
    if (!testAccess2.success) {
      console.log("✅ Session 2 correctly denied access after logout all");
    } else {
      console.log(
        "❌ Session 2 can still access after logout all (unexpected)"
      );
    }
  } else {
    console.log("❌ Logout all failed:", logoutAll.error);
  }

  console.log("\n🎉 Multi-session test completed!");
  return true;
}

// Main execution
async function main() {
  console.log("🚀 Starting Multi-Session Authentication Test\n");

  try {
    await testMultiSessionLogin();
  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
  }
}

// Run the test if the server is available
setTimeout(main, 2000); // Wait 2 seconds for server to start
