# Refresh Token System Implementation

## Overview

This document describes the implementation of a JWT refresh token system in the NestJS REST API. The system provides secure authentication with short-lived access tokens (10 minutes) and long-lived refresh tokens (7 days).

## Features Implemented

### 1. Database Schema Updates

- Added `refresh_token` column to `users` table (varchar, nullable)
- Added `refresh_token_expires_at` column to `users` table (timestamp, nullable)

### 2. Configuration Updates

- **Access Token Expiry**: Changed from 15 days to 10 minutes
- **Refresh Token Expiry**: Set to 7 days
- **Environment Variables**:
  - `JWT_EXPIRES_IN=10m`
  - `JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production`
  - `JWT_REFRESH_EXPIRES_IN=7d`

### 3. New DTOs

- `RefreshTokenDto`: For refresh token requests
- `TokenResponse`: Interface for token responses

### 4. Enhanced AuthService

- **`login()`**: Returns both access_token and refresh_token
- **`refreshToken()`**: Exchanges refresh token for new access/refresh tokens
- **`logout()`**: Invalidates refresh tokens
- **`generateRefreshToken()`**: Creates secure refresh tokens using crypto
- **`invalidateRefreshToken()`**: Helper to invalidate tokens

### 5. New API Endpoint

- **POST `/auth/refresh-token`**: Refresh access token using refresh token

## API Endpoints

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "user_name": "admin",
  "password": "admin123"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6...",
  "token_type": "Bearer_c+gi",
  "expires_in": 600,
  "user": {
    "id": 1,
    "user_name": "admin",
    "first_name": "Admin",
    "last_name": "User",
    "email": "admin@example.com",
    "role": { ... },
    "status": { ... },
    "theme": { ... }
  }
}
```

### Refresh Token

```http
POST /auth/refresh-token
Content-Type: application/json

{
  "refresh_token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6..."
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7...",
  "token_type": "Bearer_c+gi",
  "expires_in": 600
}
```

### Logout

```http
POST /auth/logout
Authorization: Bearer_c+gi <access_token>
```

**Response:**

```json
{
  "message": "Logged out successfully"
}
```

## Frontend Integration

### Axios Interceptor Setup

The system is designed to work with frontend axios interceptors:

```javascript
// Request interceptor
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer_c+gi ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const response = await axios.post("/auth/refresh-token", {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token: newRefreshToken } = response.data;

        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", newRefreshToken);

        originalRequest.headers.Authorization = `Bearer_c+gi ${access_token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

## Security Features

### 1. Token Security

- **Access tokens**: Short-lived (10 minutes) to minimize exposure
- **Refresh tokens**: Cryptographically secure random 32-byte hex strings
- **Automatic rotation**: New refresh token issued on each refresh
- **Logout invalidation**: Refresh tokens cleared on logout

### 2. Validation

- Refresh token expiry validation
- User status validation (active users only)
- Automatic cleanup of expired tokens

### 3. Custom Token Prefix

- Uses `Bearer_c+gi` prefix instead of standard `Bearer`
- Maintains existing frontend compatibility

## Database Migration

If you need to add the refresh token columns to an existing database:

```sql
ALTER TABLE users
ADD COLUMN refresh_token VARCHAR(255) NULL,
ADD COLUMN refresh_token_expires_at TIMESTAMP NULL;
```

## Testing

Run the refresh token test suite:

```bash
node test-refresh-token.js
```

The test covers:

- Login and token generation
- Access token usage
- Token refresh flow
- Invalid token handling
- Logout and token invalidation

## Error Handling

The system handles the following error scenarios:

- Invalid refresh tokens (401 Unauthorized)
- Expired refresh tokens (401 Unauthorized)
- Inactive user accounts (401 Unauthorized)
- Missing refresh tokens (401 Unauthorized)

## Best Practices

1. **Store refresh tokens securely** on the frontend (secure httpOnly cookies preferred)
2. **Implement proper cleanup** of expired tokens in production
3. **Monitor token usage** for suspicious activity
4. **Rotate refresh tokens** regularly (implemented automatically)
5. **Use HTTPS** in production to protect token transmission

## Files Modified

### Core Implementation

- `src/entities/User.ts` - Added refresh token fields
- `src/services/auth.service.ts` - Enhanced with refresh token methods
- `src/controllers/auth.controller.ts` - Added refresh endpoint

### Configuration

- `.env` - Updated JWT settings
- `src/config/configuration.ts` - Added refresh token config
- `src/app.module.ts` - Updated JWT module settings

### DTOs

- `src/dto/RefreshTokenDto.ts` - New refresh token request DTO
- `src/dto/TokenResponse.ts` - Token response interface

### Testing

- `test-refresh-token.js` - Comprehensive test suite

## Conclusion

The refresh token system provides a secure, scalable authentication solution that balances security (short access token expiry) with user experience (automatic token refresh). The implementation follows JWT best practices and integrates seamlessly with existing frontend applications.
