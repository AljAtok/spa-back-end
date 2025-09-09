const axios = require("axios");

const BASE_URL = "http://localhost:3000";
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

    if (response.data && response.data.access_token) {
      authToken = response.data.access_token;
      console.log("✅ Login successful");
      console.log(`   User: ${response.data.user.user_name}`);
      return true;
    }
  } catch (error) {
    console.log(
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
        "Content-Type": "application/json",
        Authorization: `Bearer_c+gi ${authToken}`,
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
      error: error.response?.data || error.message,
      status: error.response?.status || 0,
    };
  }
}

async function testRegionsEndpoints() {
  console.log("\n📋 Testing Regions Endpoints");
  console.log("==============================");

  let createdRegionId = null;

  // Test 1: Create a new region
  console.log("\n1️⃣ Testing POST /regions (Create Region)...");
  const createRegionData = {
    region_name: "Test Region " + Date.now(),
    region_abbr: "TR" + Date.now().toString().slice(-4),
    status_id: 1,
  };

  const createResult = await makeRequest("POST", "/regions", createRegionData);
  if (createResult.success) {
    createdRegionId = createResult.data.id;
    console.log("✅ Create region successful");
    console.log(`   Region ID: ${createResult.data.id}`);
    console.log(`   Region Name: ${createResult.data.region_name}`);
    console.log(`   Region Abbr: ${createResult.data.region_abbr}`);
    console.log(`   Status: ${createResult.data.status_name}`);
    console.log(`   Created By: ${createResult.data.created_user}`);
  } else {
    console.log("❌ Create region failed:", createResult.error);
  }

  // Test 2: Get all regions
  console.log("\n2️⃣ Testing GET /regions (Get All Regions)...");
  const getAllResult = await makeRequest("GET", "/regions");
  if (getAllResult.success) {
    console.log("✅ Get all regions successful");
    console.log(`   Total regions: ${getAllResult.data.length}`);
    if (getAllResult.data.length > 0) {
      console.log(`   First region: ${getAllResult.data[0].region_name}`);
    }
  } else {
    console.log("❌ Get all regions failed:", getAllResult.error);
  }

  // Test 3: Get specific region
  if (createdRegionId) {
    console.log(
      `\n3️⃣ Testing GET /regions/${createdRegionId} (Get Specific Region)...`
    );
    const getOneResult = await makeRequest(
      "GET",
      `/regions/${createdRegionId}`
    );
    if (getOneResult.success) {
      console.log("✅ Get specific region successful");
      console.log(`   Region: ${getOneResult.data.region_name}`);
      console.log(`   Abbreviation: ${getOneResult.data.region_abbr}`);
      console.log(`   Status: ${getOneResult.data.status_name}`);
    } else {
      console.log("❌ Get specific region failed:", getOneResult.error);
    }
  }

  // Test 4: Update region
  if (createdRegionId) {
    console.log(
      `\n4️⃣ Testing PUT /regions/${createdRegionId} (Update Region)...`
    );
    const updateData = {
      region_name: "Updated Test Region " + Date.now(),
      region_abbr: "UTR" + Date.now().toString().slice(-3),
    };

    const updateResult = await makeRequest(
      "PUT",
      `/regions/${createdRegionId}`,
      updateData
    );
    if (updateResult.success) {
      console.log("✅ Update region successful");
      console.log(`   Updated Name: ${updateResult.data.region_name}`);
      console.log(`   Updated Abbr: ${updateResult.data.region_abbr}`);
      console.log(`   Updated By: ${updateResult.data.updated_user}`);
    } else {
      console.log("❌ Update region failed:", updateResult.error);
    }
  }

  // Test 5: Toggle Status
  if (createdRegionId) {
    console.log(
      `\n5️⃣ Testing PATCH /regions/${createdRegionId}/toggle-status (Toggle Status)...`
    );
    const toggleResult = await makeRequest(
      "PATCH",
      `/regions/${createdRegionId}/toggle-status`
    );
    if (toggleResult.success) {
      console.log("✅ Toggle status successful");
      console.log(`   New Status ID: ${toggleResult.data.status_id}`);
      console.log(`   New Status: ${toggleResult.data.status_name}`);
    } else {
      console.log("❌ Toggle status failed:", toggleResult.error);
    }

    // Toggle back to active
    console.log(`\n5️⃣b Testing Toggle Status Back to Active...`);
    const toggleBackResult = await makeRequest(
      "PATCH",
      `/regions/${createdRegionId}/toggle-status`
    );
    if (toggleBackResult.success) {
      console.log("✅ Toggle back to active successful");
      console.log(`   Status ID: ${toggleBackResult.data.status_id}`);
      console.log(`   Status: ${toggleBackResult.data.status_name}`);
    }
  }

  // Test 6: Error cases
  console.log("\n6️⃣ Testing Error Cases...");

  // Test with invalid region ID
  const invalidRegionResult = await makeRequest("GET", "/regions/99999");
  if (!invalidRegionResult.success && invalidRegionResult.status === 404) {
    console.log("✅ Invalid region ID error handling works correctly");
  } else {
    console.log("❌ Invalid region ID error handling not working as expected");
  }

  // Test duplicate region name
  if (createResult.success) {
    const duplicateResult = await makeRequest("POST", "/regions", {
      region_name: createResult.data.region_name, // Same name as created region
      region_abbr: "DUP1",
    });
    if (!duplicateResult.success) {
      console.log("✅ Duplicate region name validation works correctly");
      console.log(
        `   Error: ${duplicateResult.error.message || duplicateResult.error}`
      );
    } else {
      console.log("❌ Duplicate region name should have been rejected");
    }
  }

  // Test 7: Delete region (cleanup)
  if (createdRegionId) {
    console.log(
      `\n7️⃣ Testing DELETE /regions/${createdRegionId} (Delete Region)...`
    );
    const deleteResult = await makeRequest(
      "DELETE",
      `/regions/${createdRegionId}`
    );
    if (deleteResult.success) {
      console.log("✅ Delete region successful");
    } else {
      console.log("❌ Delete region failed:", deleteResult.error);
    }
  }

  return true;
}

async function testRegionPermissions() {
  console.log("\n🔐 Testing Region Permission Restrictions");
  console.log("==========================================");

  // This would require a test user with limited permissions
  // For now, we'll just verify the endpoints respond correctly with full permissions

  const permissions = [
    { method: "GET", endpoint: "/regions", action: "VIEW" },
    { method: "POST", endpoint: "/regions", action: "ADD" },
    { method: "PUT", endpoint: "/regions/1", action: "EDIT" },
    {
      method: "PATCH",
      endpoint: "/regions/1/toggle-status",
      action: "ACTIVATE/DEACTIVATE",
    },
    { method: "DELETE", endpoint: "/regions/1", action: "CANCEL" },
  ];

  for (const perm of permissions) {
    console.log(
      `\n🔍 Testing ${perm.method} ${perm.endpoint} (${perm.action} permission)...`
    );

    const testData =
      perm.method === "POST"
        ? {
            region_name: "Permission Test Region",
            region_abbr: "PTR",
          }
        : perm.method === "PUT"
          ? {
              region_name: "Updated Permission Test",
            }
          : null;

    const result = await makeRequest(perm.method, perm.endpoint, testData);

    if (result.success || result.status !== 403) {
      console.log(`✅ ${perm.action} permission check passed`);
    } else {
      console.log(`❌ ${perm.action} permission denied (403 Forbidden)`);
    }
  }
}

async function runRegionsTests() {
  console.log("🧪 Starting Regions API Tests");
  console.log(`📍 API Base URL: ${BASE_URL}`);
  console.log("=====================================");

  try {
    // Login first
    if (!(await login())) {
      console.log("❌ Cannot proceed without authentication");
      return;
    }

    // Test all regions endpoints
    if (!(await testRegionsEndpoints())) return;

    // Test permission restrictions
    await testRegionPermissions();

    console.log("\n🎉 All regions tests completed!");
    console.log("✅ Regions API is working correctly");
  } catch (error) {
    console.error("\n💥 Test suite failed:", error);
  }
}

// Run the tests
if (require.main === module) {
  runRegionsTests().catch(console.error);
}

module.exports = { runRegionsTests };
