# Quickstart Guide: Authentication and User Access Module

**Date**: 2025-12-21
**Feature**: [specs/001-auth-user-access/spec.md](specs/001-auth-user-access/spec.md)

This guide provides a quick overview to set up and use the Authentication and User Access module.

## 1. Prerequisites

Before you begin, ensure you have the following set up:
-   Node.js (LTS version)
-   PostgreSQL database instance
-   Redis instance (optional, for session management)
-   Google Cloud Project with OAuth 2.0 credentials configured for web application (if testing Google login)

## 2. Backend Setup (Example using NestJS/Express)

Assuming you have a NestJS/Express project, you would typically integrate the authentication service.

### 2.1 Environment Variables

Configure the following in your `.env` file:
```
DATABASE_URL="postgresql://user:password@host:port/database"
JWT_SECRET="your_jwt_secret_key"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/api/v1/auth/login/google/callback"
```

### 2.2 Database Migrations

Run database migrations to create the `users` table and other necessary schemas.
```bash
# Example using TypeORM/Prisma migration commands
npm run migration:run
```

### 2.3 Start Backend Service

```bash
npm run start:dev
```

## 3. API Endpoints Overview

The following are the primary API endpoints exposed by this module. Refer to `contracts/auth.yaml` for full OpenAPI specification.

-   **`POST /api/v1/auth/register`**: User registration
-   **`POST /api/v1/auth/login/email`**: Login with email and password
-   **`GET /api/v1/auth/login/google`**: Initiate Google OAuth flow
-   **`GET /api/v1/auth/login/google/callback`**: Google OAuth callback
-   **`POST /api/v1/guest/join`**: Guest joins a meeting

## 4. Usage Examples

### 4.1 User Registration

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
-H "Content-Type: application/json" \
-d 
'{
    "email": "test@example.com",
    "password": "StrongPassword123!"
}'
```

### 4.2 Email/Password Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login/email \
-H "Content-Type: application/json" \
-d 
'{
    "email": "test@example.com",
    "password": "StrongPassword123!"
}'
```
(This will return `accessToken`, `refreshToken`, `expiresIn`)

### 4.3 Guest Join (Simulated)

```bash
curl -X POST http://localhost:3000/api/v1/guest/join \
-H "Content-Type: application/json" \
-d 
'{
    "meetingId": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "inviteCode": "MEETRA-INVITE-CODE"
}'
```
(This will return `guestSessionId`, `accessToken`)

## 5. Frontend Integration (Conceptual)

-   Use a library like `axios` or `fetch` to interact with the backend API endpoints.
-   Store JWT tokens securely (e.g., in HttpOnly cookies or browser's local storage for temporary use with refresh token mechanism).
-   Handle redirects for Google OAuth flow.

---
