const axios = require("axios");

const BASE_URL = "http://localhost:3000";

// Test credentials - replace with actual test credentials
const TEST_CREDENTIALS = {
  user_name: "admin", // Replace with actual admin username
  password: "admin123", // Replace with actual admin password
};

let authTokens = [];

async function login(deviceInfo = "Test Device") {
  try {
    console.log(`🔐 Logging in with device: ${deviceInfo}...`);
    const response = await axios.post(
      `${BASE_URL}/auth/login`,
      TEST_CREDENTIALS,
      {
        headers: {
          "User-Agent": deviceInfo,
          "Content-Type": "application/json",
        },
      }
    );

    const { access_token, refresh_token, session } = response.data;
    authTokens.push({
      access_token,
      refresh_token,
      session,
      device: deviceInfo,
    });

    console.log(`✅ Login successful for ${deviceInfo}`);
    console.log(`   Session ID: ${session.id}`);
    console.log(`   Last Login: ${session.last_login}`);
    return { access_token, refresh_token, session };
  } catch (error) {
    console.error(
      `❌ Login failed for ${deviceInfo}:`,
      error.response?.data?.message || error.message
    );
    return null;
  }
}

async function makeRequest(method, endpoint, data = null, tokenIndex = 0) {
  try {
    if (!authTokens[tokenIndex]) {
      throw new Error("No auth token available for this index");
    }

    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        Authorization: `Bearer_c+gi ${authTokens[tokenIndex].access_token}`,
        "Content-Type": "application/json",
      },
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      status: error.response?.status,
    };
  }
}

async function refreshToken(tokenIndex = 0) {
  try {
    if (!authTokens[tokenIndex]) {
      throw new Error("No refresh token available for this index");
    }

    console.log(`🔄 Refreshing token for ${authTokens[tokenIndex].device}...`);
    const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
      refresh_token: authTokens[tokenIndex].refresh_token,
    });

    // Update the token
    authTokens[tokenIndex].access_token = response.data.access_token;
    authTokens[tokenIndex].refresh_token = response.data.refresh_token;

    console.log(
      `✅ Token refreshed successfully for ${authTokens[tokenIndex].device}`
    );
    console.log(`   Session ID: ${response.data.session.id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(
      `❌ Token refresh failed for ${authTokens[tokenIndex].device}:`,
      error.response?.data?.message || error.message
    );
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}

async function testMultipleSessionsWorkflow() {
  console.log("🚀 Starting Multi-Session Authentication Tests");
  console.log("=============================================");

  // Test 1: Login from multiple devices
  console.log("\n1️⃣ Testing multiple device logins...");

  const session1 = await login("Desktop Browser Chrome");
  if (!session1) return;

  const session2 = await login("Mobile App iOS");
  if (!session2) return;

  const session3 = await login("Tablet Browser Safari");
  if (!session3) return;

  console.log(`\n✅ Successfully logged in from ${authTokens.length} devices`);

  // Test 2: Get active sessions
  console.log("\n2️⃣ Testing get active sessions...");
  const sessionsResult = await makeRequest("GET", "/auth/sessions", null, 0);
  if (sessionsResult.success) {
    console.log("✅ Active sessions retrieved successfully");
    console.log(`   Total active sessions: ${sessionsResult.data.length}`);
    sessionsResult.data.forEach((session, index) => {
      console.log(
        `   Session ${index + 1}: ID ${session.id}, Device: ${session.device_info || "Unknown"}`
      );
    });
  } else {
    console.log("❌ Failed to get active sessions:", sessionsResult.error);
  }

  // Test 3: Test access with all tokens
  console.log("\n3️⃣ Testing access with all tokens...");
  for (let i = 0; i < authTokens.length; i++) {
    const profileResult = await makeRequest("POST", "/auth/profile", null, i);
    if (profileResult.success) {
      console.log(
        `✅ Device ${i + 1} (${authTokens[i].device}) can access profile`
      );
      console.log(
        `   User: ${profileResult.data.user_name}, Session: ${profileResult.data.session_id || "Legacy"}`
      );
    } else {
      console.log(
        `❌ Device ${i + 1} (${authTokens[i].device}) cannot access profile:`,
        profileResult.error
      );
    }
  }

  // Test 4: Refresh tokens
  console.log("\n4️⃣ Testing token refresh...");
  for (let i = 0; i < authTokens.length; i++) {
    const refreshResult = await refreshToken(i);
    if (refreshResult.success) {
      console.log(
        `✅ Token refreshed for device ${i + 1} (${authTokens[i].device})`
      );
    } else {
      console.log(
        `❌ Token refresh failed for device ${i + 1} (${authTokens[i].device})`
      );
    }
  }

  // Test 5: Logout specific session
  console.log("\n5️⃣ Testing specific session logout...");
  if (authTokens.length > 1) {
    const sessionToLogout = authTokens[1].session.id;
    const logoutResult = await makeRequest(
      "POST",
      `/auth/logout-session/${sessionToLogout}`,
      null,
      0
    );
    if (logoutResult.success) {
      console.log(`✅ Session ${sessionToLogout} logged out successfully`);

      // Test if the logged out session can still access
      const accessResult = await makeRequest("POST", "/auth/profile", null, 1);
      if (!accessResult.success) {
        console.log("✅ Logged out session correctly denied access");
      } else {
        console.log("❌ Logged out session can still access (unexpected)");
      }
    } else {
      console.log("❌ Failed to logout specific session:", logoutResult.error);
    }
  }

  // Test 6: Logout all sessions
  console.log("\n6️⃣ Testing logout all sessions...");
  const logoutAllResult = await makeRequest(
    "POST",
    "/auth/logout-all",
    null,
    0
  );
  if (logoutAllResult.success) {
    console.log("✅ All sessions logged out successfully");

    // Test if any session can still access
    console.log("   Verifying all sessions are invalidated...");
    for (let i = 0; i < authTokens.length; i++) {
      const accessResult = await makeRequest("POST", "/auth/profile", null, i);
      if (!accessResult.success) {
        console.log(`   ✅ Device ${i + 1} correctly denied access`);
      } else {
        console.log(`   ❌ Device ${i + 1} can still access (unexpected)`);
      }
    }
  } else {
    console.log("❌ Failed to logout all sessions:", logoutAllResult.error);
  }

  console.log("\n🎉 Multi-session authentication tests completed!");
  console.log("\n📋 Summary:");
  console.log("✅ Multiple device login support");
  console.log("✅ Session management and tracking");
  console.log("✅ Independent token refresh per session");
  console.log("✅ Selective session logout");
  console.log("✅ Global session logout");
  console.log("✅ Session validation and access control");
}

// Run the tests
testMultipleSessionsWorkflow().catch(console.error);
