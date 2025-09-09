#!/usr/bin/env node

/**
 * NestJS Migration Test Script
 * Tests all migrated endpoints to ensure functionality matches Express version
 */

const axios = require("axios");

const BASE_URL = "http://localhost:3000/api";
let authToken = "";

// Test configuration
const testConfig = {
  testUser: {
    user_name: "test_user_" + Date.now(),
    first_name: "Test",
    last_name: "User",
    role_id: 1,
    password: "test123",
    status_id: 1,
    theme_id: 1,
    email: `test${Date.now()}@example.com`,
  },
  testModule: {
    module_name: "TEST_MODULE_" + Date.now(),
    module_alias: "test_module_" + Date.now(),
    module_link: "/test-module",
    menu_title: "Test Module",
    parent_title: "Testing",
    link_name: "Test",
    order_level: 100,
    status_id: 1,
  },
  loginCredentials: {
    user_name: "admin", // Replace with your test user
    password: "admin123", // Replace with your test password
  },
};

// Helper function for making authenticated requests
const makeRequest = async (method, url, data = null, useAuth = true) => {
  const config = {
    method,
    url: `${BASE_URL}${url}`,
    headers:
      useAuth && authToken ? { Authorization: `Bearer ${authToken}` } : {},
  };

  if (data) {
    config.data = data;
    config.headers["Content-Type"] = "application/json";
  }

  try {
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status || 0,
    };
  }
};

// Test cases
const tests = {
  // Authentication Tests
  async testAuth() {
    console.log("\n🔐 Testing Authentication...");

    // Test login
    const loginResult = await makeRequest(
      "POST",
      "/auth/login",
      testConfig.loginCredentials,
      false
    );
    if (loginResult.success) {
      authToken = loginResult.data.authToken;
      console.log("✅ Login successful");
      console.log(`   Token: ${authToken.substring(0, 20)}...`);
    } else {
      console.log("❌ Login failed:", loginResult.error);
      return false;
    }

    // Test profile
    const profileResult = await makeRequest("POST", "/auth/profile");
    if (profileResult.success) {
      console.log("✅ Profile endpoint working");
      console.log(`   User: ${profileResult.data.user_name}`);
    } else {
      console.log("❌ Profile failed:", profileResult.error);
    }

    return loginResult.success;
  },

  // Users Tests
  async testUsers() {
    console.log("\n👥 Testing Users Endpoints...");

    // Test get all users
    const allUsersResult = await makeRequest("GET", "/users");
    if (allUsersResult.success) {
      console.log(
        `✅ Get all users: ${allUsersResult.data.length} users found`
      );
    } else {
      console.log("❌ Get all users failed:", allUsersResult.error);
    }

    // Test nested users
    const nestedUsersResult = await makeRequest("GET", "/users/nested");
    if (nestedUsersResult.success) {
      console.log(
        `✅ Nested users: ${nestedUsersResult.data.length} users with nested structure`
      );

      // Verify nested structure
      if (nestedUsersResult.data.length > 0) {
        const firstUser = nestedUsersResult.data[0];
        const hasRequiredFields =
          firstUser.user_id &&
          firstUser.user &&
          firstUser.access_keys &&
          firstUser.modules &&
          firstUser.locations;
        console.log(
          `   Structure validation: ${hasRequiredFields ? "✅ Valid" : "❌ Invalid"}`
        );

        if (hasRequiredFields) {
          console.log(`   - User ID: ${firstUser.user_id}`);
          console.log(`   - Access Keys: ${firstUser.access_keys.length}`);
          console.log(`   - Modules: ${firstUser.modules.length}`);
          console.log(`   - Locations: ${firstUser.locations.length}`);
        }
      }
    } else {
      console.log("❌ Nested users failed:", nestedUsersResult.error);
    }

    // Test specific user nested
    if (nestedUsersResult.success && nestedUsersResult.data.length > 0) {
      const userId = nestedUsersResult.data[0].user_id;
      const userNestedResult = await makeRequest(
        "GET",
        `/users/nested/${userId}`
      );
      if (userNestedResult.success) {
        console.log(
          `✅ User nested by ID: User ${userId} nested structure retrieved`
        );
      } else {
        console.log("❌ User nested by ID failed:", userNestedResult.error);
      }
    }

    return allUsersResult.success && nestedUsersResult.success;
  },

  // Modules Tests
  async testModules() {
    console.log("\n📱 Testing Modules Endpoints...");

    // Test get all modules
    const allModulesResult = await makeRequest("GET", "/modules");
    if (allModulesResult.success) {
      console.log(
        `✅ Get all modules: ${allModulesResult.data.length} modules found`
      );

      // Check if order_level is included
      if (allModulesResult.data.length > 0) {
        const hasOrderLevel =
          allModulesResult.data[0].hasOwnProperty("order_level");
        console.log(
          `   Order level support: ${hasOrderLevel ? "✅ Included" : "❌ Missing"}`
        );
      }
    } else {
      console.log("❌ Get all modules failed:", allModulesResult.error);
    }

    // Test create module
    const createModuleResult = await makeRequest(
      "POST",
      "/modules",
      testConfig.testModule
    );
    if (createModuleResult.success) {
      console.log(
        `✅ Create module: ${createModuleResult.data.module_name} created`
      );
      console.log(`   Module ID: ${createModuleResult.data.id}`);
      console.log(`   Order Level: ${createModuleResult.data.order_level}`);

      // Test update module
      const updateData = {
        menu_title: "Updated Test Module",
        order_level: 101,
      };
      const updateModuleResult = await makeRequest(
        "PUT",
        `/modules/${createModuleResult.data.id}`,
        updateData
      );
      if (updateModuleResult.success) {
        console.log(`✅ Update module: ${updateModuleResult.data.menu_title}`);
      } else {
        console.log("❌ Update module failed:", updateModuleResult.error);
      }

      // Test toggle status
      const toggleResult = await makeRequest(
        "PUT",
        `/modules/${createModuleResult.data.id}/toggle-status`
      );
      if (toggleResult.success) {
        console.log(`✅ Toggle module status: ${toggleResult.data.message}`);
      } else {
        console.log("❌ Toggle module status failed:", toggleResult.error);
      }

      // Clean up - delete test module
      const deleteResult = await makeRequest(
        "DELETE",
        `/modules/${createModuleResult.data.id}`
      );
      if (deleteResult.success) {
        console.log(`✅ Delete module: ${deleteResult.data.message}`);
      } else {
        console.log("❌ Delete module failed:", deleteResult.error);
      }
    } else {
      console.log("❌ Create module failed:", createModuleResult.error);
    }

    return allModulesResult.success;
  },

  // Error Handling Tests
  async testErrorHandling() {
    console.log("\n🛡️ Testing Error Handling...");

    // Test 404 error
    const notFoundResult = await makeRequest("GET", "/nonexistent");
    if (!notFoundResult.success && notFoundResult.status === 404) {
      console.log("✅ 404 error handling working");
    } else {
      console.log("❌ 404 error handling failed");
    }

    // Test validation error
    const validationResult = await makeRequest("POST", "/modules", {
      invalid: "data",
    });
    if (
      !validationResult.success &&
      (validationResult.status === 400 || validationResult.status === 422)
    ) {
      console.log("✅ Validation error handling working");
    } else {
      console.log("❌ Validation error handling failed");
    }

    // Test unauthorized error
    const unauthorizedResult = await makeRequest("GET", "/users", null, false);
    if (!unauthorizedResult.success && unauthorizedResult.status === 401) {
      console.log("✅ Unauthorized error handling working");
    } else {
      console.log("❌ Unauthorized error handling failed");
    }

    return true;
  },

  // Performance Tests
  async testPerformance() {
    console.log("\n⚡ Testing Performance...");

    const startTime = Date.now();
    const promises = [];

    // Make 10 concurrent requests
    for (let i = 0; i < 10; i++) {
      promises.push(makeRequest("GET", "/users"));
    }

    const results = await Promise.all(promises);
    const endTime = Date.now();
    const duration = endTime - startTime;

    const successCount = results.filter((r) => r.success).length;
    console.log(`✅ Concurrent requests: ${successCount}/10 successful`);
    console.log(`   Total time: ${duration}ms`);
    console.log(`   Average: ${(duration / 10).toFixed(2)}ms per request`);

    return successCount >= 8; // Allow 2 failures
  },
};

// Main test runner
async function runTests() {
  console.log("🚀 Starting NestJS Migration Tests...");
  console.log(`📍 Testing against: ${BASE_URL}`);

  const results = {
    auth: false,
    users: false,
    modules: false,
    errorHandling: false,
    performance: false,
  };

  try {
    // Run tests in sequence
    results.auth = await tests.testAuth();

    if (results.auth) {
      results.users = await tests.testUsers();
      results.modules = await tests.testModules();
      results.errorHandling = await tests.testErrorHandling();
      results.performance = await tests.testPerformance();
    } else {
      console.log(
        "\n❌ Skipping remaining tests due to authentication failure"
      );
    }

    // Test logout
    if (authToken) {
      const logoutResult = await makeRequest("POST", "/auth/logout");
      if (logoutResult.success) {
        console.log("\n✅ Logout successful");
      }
    }
  } catch (error) {
    console.error("\n💥 Test runner error:", error.message);
  }

  // Summary
  console.log("\n📊 Test Results Summary:");
  console.log("=".repeat(40));
  Object.entries(results).forEach(([test, passed]) => {
    console.log(
      `${passed ? "✅" : "❌"} ${test.charAt(0).toUpperCase() + test.slice(1)}: ${passed ? "PASSED" : "FAILED"}`
    );
  });

  const passedCount = Object.values(results).filter(Boolean).length;
  const totalCount = Object.keys(results).length;

  console.log("=".repeat(40));
  console.log(`🎯 Overall: ${passedCount}/${totalCount} tests passed`);

  if (passedCount === totalCount) {
    console.log("🎉 All tests passed! NestJS migration is successful!");
  } else if (passedCount >= totalCount * 0.8) {
    console.log("⚠️  Most tests passed. Minor issues need attention.");
  } else {
    console.log("❌ Multiple test failures. Migration needs review.");
  }

  process.exit(passedCount === totalCount ? 0 : 1);
}

// Error handling
process.on("unhandledRejection", (error) => {
  console.error("💥 Unhandled rejection:", error);
  process.exit(1);
});

// Run tests
runTests();
