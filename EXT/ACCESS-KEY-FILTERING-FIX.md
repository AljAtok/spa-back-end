# Role Presets Access Key Filtering Fix

## Issue Summary

The `updateRolePreset` and `createRolePreset` methods in `role-action-presets.service.ts` were incorrectly fetching ALL access keys from the system when `apply_permissions_to_users` was enabled, instead of only using access keys that the specified users already had permissions for.

## Problem

**Before the fix:**

```typescript
// ❌ INCORRECT: Getting ALL access keys
const accessKeys = await this.accessKeyRepository.find();
const accessKeyIds = accessKeys.map((ak) => ak.id);
```

This meant that when updating user permissions, the system would:

- Apply permissions for ALL access keys in the system to the specified users
- Potentially grant users access to access keys they shouldn't have
- Override the principle of least privilege

## Solution

**After the fix:**

```typescript
// ✅ CORRECT: Getting only user-specific access keys
const userAccessKeys = await this.userPermissionsRepository
  .createQueryBuilder("up")
  .select("DISTINCT up.access_key_id", "access_key_id")
  .where("up.user_id IN (:...userIds)", { userIds: user_ids })
  .getRawMany();

const accessKeyIds = userAccessKeys.map((uak) => uak.access_key_id);
```

Now the system:

- Only fetches access keys that the users already have permissions for
- Maintains existing access boundaries
- Updates permissions only within the user's current access scope
- Follows the principle of least privilege

## Files Modified

1. **`src/services/role-action-presets.service.ts`**
   - Fixed `updateRolePreset` method (around line 1354)
   - Fixed `createRolePreset` method (around line 1111)

## Impact

- **Security**: Users no longer automatically receive permissions for all access keys
- **Data Integrity**: Existing access boundaries are preserved
- **Functionality**: Role preset updates now work as intended - updating permissions within existing scope

## Testing

- Compile check: ✅ No TypeScript errors
- Build check: ✅ Project builds successfully
- Unit test files created for verification:
  - `test-role-presets.js` (updated with fix documentation)
  - `test-access-key-filtering.js` (database query verification)

## Usage Example

When calling `PUT /role-presets/:id` or `POST /role-presets` with:

```json
{
  "user_ids": [1, 2],
  "apply_permissions_to_users": true,
  "presets": [{ "module_ids": 1, "action_ids": [1, 2] }]
}
```

**Before fix**: Users 1 and 2 would get permissions for ALL access keys in the system
**After fix**: Users 1 and 2 only get updated permissions for access keys they already had access to

## Verification

To verify the fix is working:

1. Check that `updateUserPermissions` is called with filtered access keys
2. Ensure users don't gain access to new access keys they didn't have before
3. Confirm role/module/action permissions are still updated correctly
