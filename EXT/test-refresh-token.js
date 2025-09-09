// Test script for refresh token functionality
const axios = require("axios");

const BASE_URL = "http://localhost:3000";

// Test credentials
const testCredentials = {
  user_name: "admin",
  password: "admin123",
};

let accessToken = "";
let refreshToken = "";

// Helper function to make authenticated requests
async function makeRequest(method, url, data = null, token = accessToken) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (token) {
      config.headers.Authorization = `Bearer_c+gi ${token}`;
    }

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status || 0,
    };
  }
}

// Test functions
async function testLogin() {
  console.log("\n🔐 Testing Login with Refresh Token...");

  const result = await makeRequest(
    "POST",
    "/auth/login",
    testCredentials,
    null
  );

  if (result.success) {
    accessToken = result.data.access_token;
    refreshToken = result.data.refresh_token;

    console.log("✅ Login successful");
    console.log(`   Access Token: ${accessToken.substring(0, 20)}...`);
    console.log(`   Refresh Token: ${refreshToken.substring(0, 20)}...`);
    console.log(`   Token Type: ${result.data.token_type}`);
    console.log(`   Expires In: ${result.data.expires_in} seconds`);
    console.log(`   User: ${result.data.user.user_name}`);

    return true;
  } else {
    console.log("❌ Login failed:", result.error);
    return false;
  }
}

async function testProfile() {
  console.log("\n👤 Testing Profile with Access Token...");

  const result = await makeRequest("POST", "/auth/profile");

  if (result.success) {
    console.log("✅ Profile endpoint working");
    console.log(`   User: ${result.data.user_name}`);
    return true;
  } else {
    console.log("❌ Profile failed:", result.error);
    return false;
  }
}

async function testRefreshToken() {
  console.log("\n🔄 Testing Refresh Token...");

  const result = await makeRequest(
    "POST",
    "/auth/refresh-token",
    { refresh_token: refreshToken },
    null
  );

  if (result.success) {
    // Update tokens
    accessToken = result.data.access_token;
    refreshToken = result.data.refresh_token;

    console.log("✅ Token refresh successful");
    console.log(`   New Access Token: ${accessToken.substring(0, 20)}...`);
    console.log(`   New Refresh Token: ${refreshToken.substring(0, 20)}...`);
    console.log(`   Token Type: ${result.data.token_type}`);
    console.log(`   Expires In: ${result.data.expires_in} seconds`);

    return true;
  } else {
    console.log("❌ Token refresh failed:", result.error);
    return false;
  }
}

async function testProfileAfterRefresh() {
  console.log("\n👤 Testing Profile after Token Refresh...");

  const result = await makeRequest("POST", "/auth/profile");

  if (result.success) {
    console.log("✅ Profile endpoint working with new token");
    console.log(`   User: ${result.data.user_name}`);
    return true;
  } else {
    console.log("❌ Profile failed with new token:", result.error);
    return false;
  }
}

async function testInvalidRefreshToken() {
  console.log("\n❌ Testing Invalid Refresh Token...");

  const result = await makeRequest(
    "POST",
    "/auth/refresh-token",
    { refresh_token: "invalid-token" },
    null
  );

  if (!result.success && result.status === 401) {
    console.log("✅ Invalid refresh token properly rejected");
    return true;
  } else {
    console.log("❌ Invalid refresh token should have been rejected");
    return false;
  }
}

async function testLogout() {
  console.log("\n🚪 Testing Logout...");

  const result = await makeRequest("POST", "/auth/logout");

  if (result.success) {
    console.log("✅ Logout successful");
    console.log(`   Message: ${result.data.message}`);
    return true;
  } else {
    console.log("❌ Logout failed:", result.error);
    return false;
  }
}

async function testExpiredRefreshToken() {
  console.log("\n⏰ Testing Refresh Token after Logout...");

  const result = await makeRequest(
    "POST",
    "/auth/refresh-token",
    { refresh_token: refreshToken },
    null
  );

  if (!result.success && result.status === 401) {
    console.log("✅ Refresh token properly invalidated after logout");
    return true;
  } else {
    console.log("❌ Refresh token should have been invalidated after logout");
    return false;
  }
}

// Wait function for timing tests
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Main test runner
async function runRefreshTokenTests() {
  console.log("🧪 Starting Refresh Token Tests");
  console.log(`📍 API Base URL: ${BASE_URL}`);
  console.log("================================================");

  try {
    // Test 1: Login and get tokens
    if (!(await testLogin())) return;

    // Test 2: Use access token
    if (!(await testProfile())) return;

    // Test 3: Refresh tokens
    if (!(await testRefreshToken())) return;

    // Test 4: Use new access token
    if (!(await testProfileAfterRefresh())) return;

    // Test 5: Test invalid refresh token
    if (!(await testInvalidRefreshToken())) return;

    // Test 6: Logout (should invalidate refresh token)
    if (!(await testLogout())) return;

    // Test 7: Try to use refresh token after logout
    if (!(await testExpiredRefreshToken())) return;

    console.log("\n🎉 All refresh token tests passed!");
    console.log("✅ Refresh token system is working correctly");
  } catch (error) {
    console.error("\n💥 Test suite failed:", error);
  }
}

// Run the tests
if (require.main === module) {
  runRefreshTokenTests().catch(console.error);
}

module.exports = { runRefreshTokenTests };
