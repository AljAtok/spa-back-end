# User Access Key Management API

This document describes the new endpoints for managing user access keys.

## Endpoints

### 1. Change User's Current Access Key

**PUT** `/users/:user_id/change-access-key`

Changes the current access key for a specific user.

#### Parameters

- `user_id` (path parameter): The ID of the user whose access key should be changed

#### Request Body

```json
{
  "access_key_id": 123
}
```

#### Validation

- The user must exist
- The access key must exist
- The user must have permission to use the specified access key (must have an active user permission record)

#### Response

```json
{
  "message": "Successfully updated current access key for user ID 1.",
  "user": {
    "id": 1,
    "user_name": "john_doe",
    "first_name": "John",
    "last_name": "Doe",
    "full_name": "John Doe",
    "current_access_key": 123,
    "current_access_key_name": "Admin Access Key",
    "role_name": "Administrator",
    "status_name": "Active",
    "updated_by": 2,
    "modified_at": "2025-06-22T10:30:00.000Z"
  }
}
```

#### Error Responses

- `404` - User not found
- `400` - Access key not found
- `400` - User does not have permission to use the specified access key
- `400` - Invalid request body

---

### 2. Get User's Current Access Key

**GET** `/users/:user_id/current-access-key`

Retrieves the current access key information for a specific user.

#### Parameters

- `user_id` (path parameter): The ID of the user

#### Response

```json
{
  "user_id": 1,
  "user_name": "john_doe",
  "full_name": "John Doe",
  "current_access_key": 123,
  "current_access_key_details": {
    "id": 123,
    "access_key_name": "Admin Access Key",
    "status_id": 1
  },
  "role_name": "Administrator",
  "status_name": "Active"
}
```

#### Error Responses

- `404` - User not found

---

### 3. Get User's Available Access Keys

**GET** `/users/:user_id/available-access-keys`

Retrieves all access keys available to a specific user (based on their permissions).

#### Parameters

- `user_id` (path parameter): The ID of the user

#### Response

```json
{
  "user_id": 1,
  "user_name": "john_doe",
  "full_name": "John Doe",
  "current_access_key": 123,
  "available_access_keys": [
    {
      "id": 123,
      "access_key_name": "Admin Access Key",
      "status_id": 1,
      "is_current": true
    },
    {
      "id": 124,
      "access_key_name": "User Access Key",
      "status_id": 1,
      "is_current": false
    }
  ]
}
```

#### Error Responses

- `404` - User not found

---

## Authentication

All endpoints require JWT authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Business Logic

1. **Access Key Validation**: When changing an access key, the system validates that:

   - The target user exists
   - The specified access key exists
   - The user has an active permission record for that access key

2. **Permission Check**: Only access keys that the user has permissions for (via the `user_permissions` table with `status_id = 1`) are considered available.

3. **Audit Trail**: The system tracks who made the change (`updated_by`) and when (`modified_at`).

## Example Usage

### Change Access Key

```bash
curl -X PUT http://localhost:3000/users/1/change-access-key \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"access_key_id": 123}'
```

### Get Current Access Key

```bash
curl -X GET http://localhost:3000/users/1/current-access-key \
  -H "Authorization: Bearer <token>"
```

### Get Available Access Keys

```bash
curl -X GET http://localhost:3000/users/1/available-access-keys \
  -H "Authorization: Bearer <token>"
```

## Testing

Run the test script to verify all endpoints:

```bash
node test-user-access-key.js
```

Make sure to update the test credentials in the script before running.
