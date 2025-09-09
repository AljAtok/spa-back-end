const axios = require("axios");

const BASE_URL = "http://localhost:3000";

// Test credentials - replace with actual test credentials
const TEST_CREDENTIALS = {
  user_name: "admin", // Replace with actual admin username
  password: "admin123", // Replace with actual admin password
};

let authToken = "";

async function login() {
  try {
    console.log("🔐 Logging in...");
    const response = await axios.post(
      `${BASE_URL}/auth/login`,
      TEST_CREDENTIALS
    );
    authToken = response.data.access_token;
    console.log("✅ Login successful");
    return true;
  } catch (error) {
    console.error(
      "❌ Login failed:",
      error.response?.data?.message || error.message
    );
    return false;
  }
}

async function makeRequest(method, endpoint, data = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        Authorization: `Bearer ${authToken}`,
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

async function testUserAccessKeyEndpoints() {
  console.log("\n📋 Testing User Access Key Endpoints");
  console.log("=====================================");

  // First, let's get a list of users to test with
  const usersResult = await makeRequest("GET", "/users");
  if (!usersResult.success) {
    console.log("❌ Failed to get users:", usersResult.error);
    return false;
  }

  if (!usersResult.data || usersResult.data.length === 0) {
    console.log("❌ No users found for testing");
    return false;
  }

  const testUser = usersResult.data[0];
  const userId = testUser.id;
  console.log(`📋 Testing with User ID: ${userId} (${testUser.user_name})`);

  // Test 1: Get current access key
  console.log("\n1️⃣ Testing GET current access key...");
  const currentAccessKeyResult = await makeRequest(
    "GET",
    `/users/${userId}/current-access-key`
  );
  if (currentAccessKeyResult.success) {
    console.log("✅ Get current access key successful");
    console.log(
      `   Current access key: ${currentAccessKeyResult.data.current_access_key}`
    );
    console.log(
      `   Access key name: ${currentAccessKeyResult.data.current_access_key_details?.access_key_name || "None"}`
    );
  } else {
    console.log(
      "❌ Get current access key failed:",
      currentAccessKeyResult.error
    );
  }

  // Test 2: Get available access keys
  console.log("\n2️⃣ Testing GET available access keys...");
  const availableKeysResult = await makeRequest(
    "GET",
    `/users/${userId}/available-access-keys`
  );
  if (availableKeysResult.success) {
    console.log("✅ Get available access keys successful");
    console.log(
      `   Available access keys: ${availableKeysResult.data.available_access_keys.length}`
    );
    availableKeysResult.data.available_access_keys.forEach((key, index) => {
      console.log(
        `   ${index + 1}. ${key.access_key_name} (ID: ${key.id}) ${key.is_current ? "← Current" : ""}`
      );
    });

    // Test 3: Change access key (if there are available keys)
    if (availableKeysResult.data.available_access_keys.length > 0) {
      // Find a different access key to change to
      const currentKey = availableKeysResult.data.current_access_key;
      const differentKey = availableKeysResult.data.available_access_keys.find(
        (key) => key.id !== currentKey
      );

      if (differentKey) {
        console.log(
          `\n3️⃣ Testing PUT change access key to: ${differentKey.access_key_name} (ID: ${differentKey.id})...`
        );
        const changeKeyResult = await makeRequest(
          "PUT",
          `/users/${userId}/change-access-key`,
          {
            access_key_id: differentKey.id,
          }
        );

        if (changeKeyResult.success) {
          console.log("✅ Change access key successful");
          console.log(
            `   New current access key: ${changeKeyResult.data.user.current_access_key}`
          );
          console.log(
            `   New access key name: ${changeKeyResult.data.user.current_access_key_name}`
          );
          console.log(`   Message: ${changeKeyResult.data.message}`);
        } else {
          console.log("❌ Change access key failed:", changeKeyResult.error);
        }
      } else {
        console.log(
          "⚠️  No different access key available to test change functionality"
        );
      }
    } else {
      console.log("⚠️  No available access keys found for this user");
    }
  } else {
    console.log(
      "❌ Get available access keys failed:",
      availableKeysResult.error
    );
  }

  // Test 4: Test error cases
  console.log("\n4️⃣ Testing error cases...");

  // Test with invalid user ID
  const invalidUserResult = await makeRequest(
    "GET",
    "/users/99999/current-access-key"
  );
  if (!invalidUserResult.success && invalidUserResult.status === 404) {
    console.log("✅ Invalid user ID error handling works correctly");
  } else {
    console.log("❌ Invalid user ID error handling not working as expected");
  }

  // Test with invalid access key ID
  const invalidKeyResult = await makeRequest(
    "PUT",
    `/users/${userId}/change-access-key`,
    {
      access_key_id: 99999,
    }
  );
  if (!invalidKeyResult.success) {
    console.log("✅ Invalid access key ID error handling works correctly");
    console.log(`   Error: ${invalidKeyResult.error}`);
  } else {
    console.log("❌ Invalid access key ID should have failed");
  }

  return true;
}

async function runTests() {
  console.log("🚀 Starting User Access Key Service Tests");
  console.log("==========================================");

  // Login first
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log("❌ Cannot proceed without authentication");
    return;
  }

  // Test user access key endpoints
  await testUserAccessKeyEndpoints();

  console.log("\n🎉 Test execution completed!");
}

// Run the tests
runTests().catch(console.error);
