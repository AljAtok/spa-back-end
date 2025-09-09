const axios = require("axios");

// ✅ FIXED: Access Key Filtering Logic
// The updateRolePreset and createRolePreset methods now correctly filter access keys
// to only include access keys that the specified users already have permissions for,
// instead of applying ALL access keys from the system.
//
// This means:
// - Only existing user permissions will be updated with new role/module/action combinations
// - No new access keys will be automatically granted to users
// - Users maintain their current access key scope

// Configuration
const BASE_URL = "http://localhost:3000";
const API_TOKEN = "your-jwt-token-here"; // Replace with actual token

// Test data
const testData = {
  createRolePreset: {
    role_id: 1,
    location_ids: [1, 2],
    presets: [
      {
        module_ids: 1,
        action_ids: [1, 2],
      },
    ],
    status_id: 1,
    user_ids: [1, 2], // New field
    apply_permissions_to_users: true, // New field
    apply_locations_to_users: true, // New field
  },
  updateRolePreset: {
    location_ids: [1, 3],
    presets: [
      {
        module_ids: 1,
        action_ids: [1, 3],
      },
    ],
    status_id: 1,
    user_ids: [1, 3], // New field
    apply_permissions_to_users: true, // New field
    apply_locations_to_users: false, // New field
  },
};

// Helper function to make authenticated requests
async function makeRequest(method, url, data = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(
      `Error ${method} ${url}:`,
      error.response?.data || error.message
    );
    throw error;
  }
}

// Test functions
async function testCreateRolePreset() {
  console.log("\n=== Testing CREATE Role Preset ===");
  console.log("Payload:", JSON.stringify(testData.createRolePreset, null, 2));

  try {
    const result = await makeRequest(
      "POST",
      "/role-presets",
      testData.createRolePreset
    );
    console.log("✅ CREATE successful:", JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.log("❌ CREATE failed");
    return null;
  }
}

async function testUpdateRolePreset(roleId) {
  console.log("\n=== Testing UPDATE Role Preset ===");
  console.log("Payload:", JSON.stringify(testData.updateRolePreset, null, 2));

  try {
    const result = await makeRequest(
      "PUT",
      `/role-presets/${roleId}`,
      testData.updateRolePreset
    );
    console.log("✅ UPDATE successful:", JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.log("❌ UPDATE failed");
    return null;
  }
}

async function testGetRolePresets(roleId) {
  console.log("\n=== Testing GET Role Presets ===");

  try {
    const result = await makeRequest("GET", `/role-presets/${roleId}`);
    console.log("✅ GET successful:", JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.log("❌ GET failed");
    return null;
  }
}

// Main test runner
async function runTests() {
  console.log("🚀 Starting Role Presets API Tests...");
  console.log("Base URL:", BASE_URL);

  // Test 1: Create role preset with new functionality
  const createResult = await testCreateRolePreset();
  if (!createResult) {
    console.log("❌ Stopping tests - CREATE failed");
    return;
  }

  const roleId = createResult.role_id || testData.createRolePreset.role_id;

  // Test 2: Get role presets to verify creation
  await testGetRolePresets(roleId);

  // Test 3: Update role preset with new functionality
  await testUpdateRolePreset(roleId);

  // Test 4: Get role presets again to verify update
  await testGetRolePresets(roleId);

  console.log("\n🎉 Tests completed!");
}

// Instructions for running
if (require.main === module) {
  console.log("⚠️  SETUP REQUIRED:");
  console.log("1. Make sure the NestJS server is running on port 3000");
  console.log("2. Replace API_TOKEN with a valid JWT token");
  console.log(
    "3. Verify test data (role_id, location_ids, user_ids) exist in your database"
  );
  console.log("4. Run: node test-role-presets.js\n");

  // Uncomment the line below to run tests
  // runTests();
} else {
  module.exports = { runTests, testData };
}
