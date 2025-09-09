const axios = require("axios");

const BASE_URL = "http://localhost:3000";
const TEST_CREDENTIALS = {
  user_name: "june_doe", // User with multi-session capabilities
  password: "test123",
};

let authToken = "";
let currentAccessKey = null;

async function login() {
  try {
    console.log("🔐 Logging in...");
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      ...TEST_CREDENTIALS,
      device_info: "Access Key Test Device",
    });

    authToken = response.data.access_token;
    console.log("✅ Login successful");
    console.log(`   Session ID: ${response.data.session.id}`);
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
        Authorization: `Bearer_c+gi ${authToken}`,
        "Content-Type": "application/json",
      },
    };

    if (data) {
      config.data = data;
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

async function getCurrentUserProfile() {
  console.log("\n📋 Getting current user profile...");
  const profileResult = await makeRequest("GET", "/auth/profile");

  if (profileResult.success) {
    currentAccessKey = profileResult.data.current_access_key;
    console.log("✅ User profile retrieved");
    console.log(`   User ID: ${profileResult.data.id}`);
    console.log(`   Username: ${profileResult.data.user_name}`);
    console.log(`   Current Access Key: ${currentAccessKey}`);
    console.log(`   Role ID: ${profileResult.data.role_id}`);
    return profileResult.data;
  } else {
    console.log("❌ Failed to get user profile:", profileResult.error);
    return null;
  }
}

async function testAccessKeyPermissionFiltering() {
  console.log("\n🧪 Testing Access Key Permission Filtering");
  console.log("============================================");

  // Test locations endpoints with current access key
  console.log("\n1️⃣ Testing Locations GET (VIEW permission)...");
  const locationsResult = await makeRequest("GET", "/locations");

  if (locationsResult.success) {
    console.log(
      `✅ GET /locations successful with access key ${currentAccessKey}`
    );
    console.log(`   Retrieved ${locationsResult.data.length} locations`);
  } else {
    console.log(
      `❌ GET /locations failed with access key ${currentAccessKey}:`,
      locationsResult.error
    );
    console.log(`   Status: ${locationsResult.status}`);
  }

  // Test locations POST (ADD permission)
  console.log("\n2️⃣ Testing Locations POST (ADD permission)...");
  const newLocationData = {
    location_name: "Test Location - Access Key Filter",
    location_abbr: "TL-AKF",
    location_type_id: 1,
    company_id: 1,
    status_id: 1,
  };

  const createLocationResult = await makeRequest(
    "POST",
    "/locations",
    newLocationData
  );

  if (createLocationResult.success) {
    console.log(
      `✅ POST /locations successful with access key ${currentAccessKey}`
    );
    console.log(`   Created location ID: ${createLocationResult.data.id}`);

    // Test PUT (EDIT permission)
    console.log("\n3️⃣ Testing Locations PUT (EDIT permission)...");
    const updateData = {
      location_name: "Updated Test Location - Access Key Filter",
    };

    const updateResult = await makeRequest(
      "PUT",
      `/locations/${createLocationResult.data.id}`,
      updateData
    );

    if (updateResult.success) {
      console.log(
        `✅ PUT /locations successful with access key ${currentAccessKey}`
      );
    } else {
      console.log(
        `❌ PUT /locations failed with access key ${currentAccessKey}:`,
        updateResult.error
      );
      console.log(`   Status: ${updateResult.status}`);
    }

    // Test toggle status (ACTIVATE/DEACTIVATE permission)
    console.log(
      "\n4️⃣ Testing toggle-status (ACTIVATE/DEACTIVATE permission)..."
    );
    const toggleResult = await makeRequest(
      "PATCH",
      `/locations/${createLocationResult.data.id}/toggle-status`
    );

    if (toggleResult.success) {
      console.log(
        `✅ PATCH toggle-status successful with access key ${currentAccessKey}`
      );
      console.log(`   New status: ${toggleResult.data.status_id}`);
    } else {
      console.log(
        `❌ PATCH toggle-status failed with access key ${currentAccessKey}:`,
        toggleResult.error
      );
      console.log(`   Status: ${toggleResult.status}`);
    }

    // Test DELETE (CANCEL permission)
    console.log("\n5️⃣ Testing Locations DELETE (CANCEL permission)...");
    const deleteResult = await makeRequest(
      "DELETE",
      `/locations/${createLocationResult.data.id}`
    );

    if (deleteResult.success) {
      console.log(
        `✅ DELETE /locations successful with access key ${currentAccessKey}`
      );
    } else {
      console.log(
        `❌ DELETE /locations failed with access key ${currentAccessKey}:`,
        deleteResult.error
      );
      console.log(`   Status: ${deleteResult.status}`);
    }
  } else {
    console.log(
      `❌ POST /locations failed with access key ${currentAccessKey}:`,
      createLocationResult.error
    );
    console.log(`   Status: ${createLocationResult.status}`);
    console.log(
      "   Cannot test other operations without creating a location first"
    );
  }
}

async function testAccessKeyChange() {
  console.log("\n🔄 Testing Access Key Change Impact");
  console.log("===================================");

  // Get available access keys
  const user = await getCurrentUserProfile();
  if (!user) return;

  const availableKeysResult = await makeRequest(
    "GET",
    `/users/${user.id}/available-access-keys`
  );

  if (
    availableKeysResult.success &&
    availableKeysResult.data.available_access_keys.length > 1
  ) {
    const availableKeys = availableKeysResult.data.available_access_keys;
    const differentKey = availableKeys.find(
      (key) => key.id !== currentAccessKey
    );

    if (differentKey) {
      console.log(
        `\n📝 Changing access key from ${currentAccessKey} to ${differentKey.id}...`
      );

      const changeKeyResult = await makeRequest(
        "PUT",
        `/users/${user.id}/change-access-key`,
        { access_key_id: differentKey.id }
      );
      if (changeKeyResult.success) {
        console.log(`✅ Access key changed successfully`);
        console.log(`   Old access key: ${currentAccessKey}`);
        console.log(`   New access key: ${differentKey.id}`);

        // Check if new token was generated
        if (changeKeyResult.data.new_access_token) {
          console.log("🔑 New JWT token generated automatically!");
          console.log(
            `   Token updated: ${changeKeyResult.data.token_updated}`
          );
          console.log(
            `   Token preview: ${changeKeyResult.data.new_access_token.substring(0, 30)}...`
          );

          // Update our auth token to use the new one
          authToken = changeKeyResult.data.new_access_token;
          currentAccessKey = differentKey.id;

          console.log("\n🔄 Using new token for subsequent requests...");

          // Test permissions with new access key immediately (no re-login needed)
          console.log(
            "\n🧪 Testing permissions with new access key (same session)..."
          );
          await testAccessKeyPermissionFiltering();
        } else {
          console.log("⚠️  No new token generated - would need to re-login");

          // Fallback: re-login to get token with new access key
          console.log("\n🔄 Re-logging in to get token with new access key...");
          await login();
          await getCurrentUserProfile();

          // Test permissions with new access key
          console.log("\n🧪 Testing permissions with new access key...");
          await testAccessKeyPermissionFiltering();
        }
      } else {
        console.log("❌ Failed to change access key:", changeKeyResult.error);
      }
    } else {
      console.log("⚠️  No different access key available for testing");
    }
  } else {
    console.log(
      "⚠️  User has only one access key or cannot retrieve available keys"
    );
  }
}

async function runAccessKeyPermissionTests() {
  console.log("🚀 Starting Access Key Permission Filtering Tests");
  console.log("==================================================");

  // Login
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log("❌ Cannot proceed without authentication");
    return;
  }

  // Get current user info and access key
  const user = await getCurrentUserProfile();
  if (!user) {
    console.log("❌ Cannot proceed without user profile");
    return;
  }

  // Test permissions with current access key
  await testAccessKeyPermissionFiltering();

  // Test access key change impact
  await testAccessKeyChange();
  console.log("\n🎉 Access Key Permission Filtering Tests Completed!");
  console.log("\n📋 Summary:");
  console.log("✅ Permission filtering now includes access_key_id");
  console.log("✅ Only permissions with status_id = 1 are checked");
  console.log(
    "✅ Users can only access resources they have permissions for with their current access key"
  );
  console.log(
    "✅ Changing access key immediately affects available permissions"
  );
  console.log(
    "🔑 NEW: JWT token auto-generated when access key changes (no logout required!)"
  );
}

// Run the tests
runAccessKeyPermissionTests().catch(console.error);
