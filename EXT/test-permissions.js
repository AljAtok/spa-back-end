const axios = require("axios");

const BASE_URL = "http://localhost:3000";
const TEST_CREDENTIALS = {
  user_name: "june_doe",
  password: "test123",
};

let authToken = "";

async function makeRequest(
  method,
  endpoint,
  data = null,
  expectedStatus = null
) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {},
    };

    if (data) {
      config.data = data;
    }

    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await axios(config);
    return {
      success: true,
      data: response.data,
      status: response.status,
      message: "Request successful",
    };
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    // If we expected this status, it's a "success"
    if (expectedStatus && status === expectedStatus) {
      return {
        success: true,
        status: status,
        message: message,
        expected: true,
      };
    }

    return {
      success: false,
      error: message,
      status: status,
    };
  }
}

async function login() {
  console.log("🔐 Logging in...");
  const result = await makeRequest("POST", "/auth/login", TEST_CREDENTIALS);

  if (result.success) {
    authToken = result.data.access_token;
    console.log("✅ Login successful");
    return true;
  } else {
    console.log("❌ Login failed:", result.error);
    return false;
  }
}

async function testPermissionSystem() {
  console.log("\n🛡️  Testing Permission-Based Access Control\n");

  // Test 1: GET /locations (requires VIEW permission)
  console.log("1️⃣ Testing GET /locations (requires VIEW permission)...");
  const getLocations = await makeRequest("GET", "/locations");
  if (getLocations.success) {
    console.log("✅ GET /locations - Access granted");
  } else {
    console.log(`❌ GET /locations - Access denied: ${getLocations.error}`);
  }

  // Test 2: POST /locations (requires ADD permission)
  console.log("\n2️⃣ Testing POST /locations (requires ADD permission)...");
  const testLocationData = {
    location_name: "TEST LOCATION PERMISSION",
    location_type_id: 1,
    company_id: 1,
    status_id: 1,
  };

  const postLocation = await makeRequest(
    "POST",
    "/locations",
    testLocationData
  );
  if (postLocation.success) {
    console.log("✅ POST /locations - Access granted");
    console.log(`   Created location ID: ${postLocation.data.location?.id}`);
  } else {
    console.log(`❌ POST /locations - Access denied: ${postLocation.error}`);
  }

  // Test 3: PUT /locations/:id (requires EDIT permission)
  console.log("\n3️⃣ Testing PUT /locations/1 (requires EDIT permission)...");
  const updateLocationData = {
    location_name: "UPDATED TEST LOCATION",
    location_type_id: 1,
    company_id: 1,
    status_id: 1,
  };

  const putLocation = await makeRequest(
    "PUT",
    "/locations/1",
    updateLocationData
  );
  if (putLocation.success) {
    console.log("✅ PUT /locations/1 - Access granted");
  } else {
    console.log(`❌ PUT /locations/1 - Access denied: ${putLocation.error}`);
  }

  // Test 4: PATCH /locations/:id/toggle-status (requires ACTIVATE/DEACTIVATE permission)
  console.log(
    "\n4️⃣ Testing PATCH /locations/1/toggle-status (requires ACTIVATE/DEACTIVATE permission)..."
  );
  const toggleStatus = await makeRequest("PATCH", "/locations/1/toggle-status");
  if (toggleStatus.success) {
    console.log("✅ PATCH /locations/1/toggle-status - Access granted");
  } else {
    console.log(
      `❌ PATCH /locations/1/toggle-status - Access denied: ${toggleStatus.error}`
    );
  }

  // Test 5: DELETE /locations/:id (requires CANCEL permission)
  console.log(
    "\n5️⃣ Testing DELETE /locations/999 (requires CANCEL permission)..."
  );
  const deleteLocation = await makeRequest("DELETE", "/locations/999");
  if (deleteLocation.success) {
    console.log("✅ DELETE /locations/999 - Access granted");
  } else {
    console.log(
      `❌ DELETE /locations/999 - Access denied: ${deleteLocation.error}`
    );
  }

  // Test 6: Test without authentication (should fail)
  console.log("\n6️⃣ Testing without authentication (should return 401)...");
  const oldToken = authToken;
  authToken = "";
  const noAuthTest = await makeRequest("GET", "/locations", null, 401);
  authToken = oldToken;

  if (noAuthTest.expected) {
    console.log("✅ No auth test - Correctly denied access (401)");
  } else {
    console.log(`❌ No auth test - Unexpected result: ${noAuthTest.status}`);
  }

  console.log("\n🎉 Permission testing completed!");
}

async function main() {
  console.log("🚀 Starting Permission System Test\n");

  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log("❌ Cannot proceed without login");
    return;
  }

  await testPermissionSystem();
}

// Run the test
main().catch(console.error);
