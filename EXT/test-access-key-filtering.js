// Test script to verify the access key filtering logic
const { Pool } = require("pg");

// Configuration - replace with your database settings
const pool = new Pool({
  user: "your_username",
  host: "localhost",
  database: "your_database",
  password: "your_password",
  port: 5432,
});

async function testAccessKeyFiltering() {
  try {
    console.log("🧪 Testing Access Key Filtering Logic\n");

    // Test data setup
    const testUserIds = [1, 2, 3]; // Replace with actual user IDs in your database

    console.log("1. Testing the old logic (getting ALL access keys):");
    const allAccessKeysQuery = "SELECT id FROM access_key ORDER BY id";
    const allAccessKeysResult = await pool.query(allAccessKeysQuery);
    const allAccessKeys = allAccessKeysResult.rows.map((row) => row.id);
    console.log("   All access keys:", allAccessKeys);

    console.log(
      "\n2. Testing the new logic (getting only user-specific access keys):"
    );
    const userAccessKeysQuery = `
      SELECT DISTINCT access_key_id 
      FROM user_permissions 
      WHERE user_id = ANY($1)
      ORDER BY access_key_id
    `;
    const userAccessKeysResult = await pool.query(userAccessKeysQuery, [
      testUserIds,
    ]);
    const userAccessKeys = userAccessKeysResult.rows.map(
      (row) => row.access_key_id
    );
    console.log("   User-specific access keys:", userAccessKeys);

    console.log("\n3. Comparison:");
    console.log(`   Total access keys in system: ${allAccessKeys.length}`);
    console.log(
      `   Access keys for users ${testUserIds.join(", ")}: ${userAccessKeys.length}`
    );
    console.log(
      `   Reduction: ${allAccessKeys.length - userAccessKeys.length} fewer access keys`
    );

    if (userAccessKeys.length < allAccessKeys.length) {
      console.log(
        "   ✅ IMPROVEMENT: New logic correctly filters access keys!"
      );
    } else if (userAccessKeys.length === allAccessKeys.length) {
      console.log(
        "   ⚠️  WARNING: Users have permissions for ALL access keys (same result)"
      );
    } else {
      console.log("   ❌ ERROR: Something went wrong with the query");
    }

    console.log("\n4. Detailed user permissions breakdown:");
    for (const userId of testUserIds) {
      const userPermissionsQuery = `
        SELECT DISTINCT up.access_key_id, ak.access_key_name
        FROM user_permissions up
        JOIN access_key ak ON up.access_key_id = ak.id
        WHERE up.user_id = $1
        ORDER BY up.access_key_id
      `;
      const userPermsResult = await pool.query(userPermissionsQuery, [userId]);
      console.log(
        `   User ${userId} has permissions for access keys:`,
        userPermsResult.rows.map(
          (row) => `${row.access_key_id} (${row.access_key_name})`
        )
      );
    }
  } catch (error) {
    console.error("❌ Error testing access key filtering:", error.message);
  } finally {
    await pool.end();
  }
}

// Instructions
console.log("📋 SETUP INSTRUCTIONS:");
console.log("1. Update the database connection settings in this file");
console.log("2. Update testUserIds with actual user IDs from your database");
console.log("3. Run: node test-access-key-filtering.js\n");

// Uncomment the line below to run the test
// testAccessKeyFiltering();

module.exports = { testAccessKeyFiltering };
