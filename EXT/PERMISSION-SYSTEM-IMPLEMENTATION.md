# Permission-Based Access Control Implementation ✅

## Overview

This implementation provides a comprehensive permission-based access control system for all API routes. Users must have specific permissions for each action on each module.

## Components

### 1. Permission Decorator (`@RequirePermissions`)

```typescript
@RequirePermissions({ module: 'LOCATIONS', action: 'VIEW' })
```

- Defines required permissions for route access
- Supports multiple permission requirements
- Module and action names are case-insensitive

### 2. Permissions Guard (`PermissionsGuard`)

- Validates user permissions against database
- Checks UserPermissions table for active permissions
- Returns 403 Forbidden if permission is missing

### 3. Dynamic Permissions Guard (`DynamicPermissionsGuard`)

- Handles complex permission logic (e.g., toggle-status)
- Determines required permission based on resource state
- For toggle-status: checks current status to determine ACTIVATE/DEACTIVATE

## Implementation Pattern

### Standard Routes

```typescript
@Controller("locations")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LocationsController {

  @Get()
  @RequirePermissions({ module: 'LOCATIONS', action: 'VIEW' })
  async findAll() { ... }

  @Post()
  @RequirePermissions({ module: 'LOCATIONS', action: 'ADD' })
  async create() { ... }

  @Put(":id")
  @RequirePermissions({ module: 'LOCATIONS', action: 'EDIT' })
  async update() { ... }

  @Delete(":id")
  @RequirePermissions({ module: 'LOCATIONS', action: 'CANCEL' })
  async remove() { ... }
}
```

### Dynamic Permission Routes

```typescript
@Patch(":id/toggle-status")
@UseGuards(JwtAuthGuard, DynamicPermissionsGuard)
async toggleStatus() { ... }
```

## Permission Mapping

| HTTP Method | Endpoint Pattern              | Required Permission      |
| ----------- | ----------------------------- | ------------------------ |
| GET         | `/resource`                   | VIEW                     |
| GET         | `/resource/:id`               | VIEW                     |
| POST        | `/resource`                   | ADD                      |
| PUT         | `/resource/:id`               | EDIT                     |
| DELETE      | `/resource/:id`               | CANCEL                   |
| PATCH       | `/resource/:id/toggle-status` | ACTIVATE or DEACTIVATE\* |

\*Dynamic based on current resource status

## Error Responses

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "Access denied: You don't have VIEW permission for LOCATIONS"
}
```

## Usage Examples

### Apply to All Controllers

```typescript
@Controller("users")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {

  @Get()
  @RequirePermissions({ module: 'USERS', action: 'VIEW' })
  async findAll() { ... }

  @Post()
  @RequirePermissions({ module: 'USERS', action: 'ADD' })
  async create() { ... }
}
```

### Multiple Permissions

```typescript
@Get("special-endpoint")
@RequirePermissions(
  { module: 'USERS', action: 'VIEW' },
  { module: 'REPORTS', action: 'GENERATE' }
)
async specialEndpoint() { ... }
```

## Database Requirements

### UserPermissions Table

- `user_id` - User ID
- `module_id` - Module ID (links to modules table)
- `action_id` - Action ID (links to actions table)
- `status_id` - Must be 1 (active) for permission to be valid

### Modules Table

- Contains module definitions (USERS, LOCATIONS, etc.)
- `module_name` field used for permission checking

### Actions Table

- Contains action definitions (VIEW, ADD, EDIT, etc.)
- `action_name` field used for permission checking

## Testing

Run the permission test script:

```bash
node test-permissions.js
```

This will test:

1. ✅ GET requests (VIEW permission)
2. ✅ POST requests (ADD permission)
3. ✅ PUT requests (EDIT permission)
4. ✅ PATCH toggle-status (ACTIVATE/DEACTIVATE permission)
5. ✅ DELETE requests (CANCEL permission)
6. ✅ Unauthorized access attempts

## Benefits

1. **Granular Control** - Specific permissions for each action
2. **Database-Driven** - Permissions stored and managed in database
3. **Flexible** - Easy to add new modules and actions
4. **Secure** - Default deny, explicit allow
5. **Auditable** - Clear permission requirements for each endpoint
6. **Scalable** - Works across all controllers and modules

## Implementation Steps for Other Controllers

1. **Import Guards and Decorator**:

```typescript
import { PermissionsGuard } from "../guards/permissions.guard";
import { RequirePermissions } from "../decorators/permissions.decorator";
```

2. **Apply Guards**:

```typescript
@UseGuards(JwtAuthGuard, PermissionsGuard)
```

3. **Add Permission Requirements**:

```typescript
@RequirePermissions({ module: 'MODULE_NAME', action: 'ACTION_NAME' })
```

4. **For Toggle-Status Endpoints**:

```typescript
@UseGuards(JwtAuthGuard, DynamicPermissionsGuard)
```

## Security Features

- ✅ **Authentication Required** - Must be logged in
- ✅ **Session Validation** - Valid session required
- ✅ **Permission Validation** - Specific permissions checked
- ✅ **Database Verification** - Real-time permission lookup
- ✅ **Detailed Logging** - Permission denials logged
- ✅ **Clear Error Messages** - Informative 403 responses

The permission system is now ready for production use and can be applied to all controllers following the same pattern! 🎉
