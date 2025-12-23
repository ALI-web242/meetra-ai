# Quickstart Guide: Authentication and User Access Module

**Date**: 2025-12-22
**Feature**: [specs/001-auth-user-access/spec.md](specs/001-auth-user-access/spec.md)

This guide provides a quick overview to set up and use the Authentication and User Access module.

## 1. Prerequisites

Before you begin, ensure you have the following:
- Node.js v18+ (LTS version recommended)
- npm or yarn
- Neon PostgreSQL database (or any PostgreSQL instance)
- Google Cloud Project with OAuth 2.0 credentials (optional, for Google login)

## 2. Project Structure

```
project/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── guest/          # Guest access module
│   │   ├── user/           # User entity
│   │   ├── middleware/     # Error handling, logging
│   │   └── utils/          # Password utilities
│   └── tests/              # Unit & integration tests
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Pages (register, login, join)
│   │   ├── components/    # Auth & UI components
│   │   └── services/      # Auth service
│   └── tests/             # Component tests
└── e2e/                   # Playwright E2E tests
```

## 3. Backend Setup

### 3.1 Install Dependencies

```bash
cd backend
npm install
```

### 3.2 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# JWT Configuration
JWT_SECRET="your-secure-jwt-secret-key-min-32-chars"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/api/v1/auth/login/google/callback"

# Frontend URL (for CORS and OAuth redirects)
FRONTEND_URL="http://localhost:3001"

# Server Port
PORT=3000
```

### 3.3 Start Backend

```bash
# Development mode (with hot reload)
npm run start:dev

# Production build
npm run build
npm run start:prod
```

### 3.4 Run Tests

```bash
# Unit & integration tests
npm test

# E2E tests (requires backend running)
npm run test:e2e
```

## 4. Frontend Setup

### 4.1 Install Dependencies

```bash
cd frontend
npm install
```

### 4.2 Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4.3 Start Frontend

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The frontend will be available at `http://localhost:3001`.

## 5. API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login/email` | Login with email/password |
| GET | `/api/v1/auth/login/google` | Initiate Google OAuth |
| GET | `/api/v1/auth/login/google/callback` | Google OAuth callback |
| POST | `/api/v1/guest/join` | Join meeting as guest |

See `contracts/auth.yaml` for full OpenAPI specification.

## 6. Usage Examples

### 6.1 User Registration

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "StrongPassword123!"
  }'
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 3600,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com"
  }
}
```

### 6.2 User Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "StrongPassword123!"
  }'
```

### 6.3 Guest Join Meeting

```bash
curl -X POST http://localhost:3000/api/v1/guest/join \
  -H "Content-Type: application/json" \
  -d '{
    "meetingId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

**Response:**
```json
{
  "guestSessionId": "660e8400-e29b-41d4-a716-446655440001",
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresAt": "2024-12-23T12:00:00.000Z"
}
```

## 7. Frontend Pages

| URL | Description |
|-----|-------------|
| `/register` | User registration page |
| `/login` | User login page |
| `/join/[meetingId]` | Guest join meeting page |
| `/auth/callback` | OAuth callback handler |

## 8. Security Features

- **Password Validation**: Min 8 chars, uppercase, lowercase, number, special character
- **JWT Authentication**: Access tokens (1h) and refresh tokens (7d)
- **Rate Limiting**: 10 requests per minute per IP
- **Input Validation**: class-validator for all DTOs
- **Error Handling**: Global exception filter with structured responses

## 9. Deployment

### 9.1 Backend Deployment (Railway/Render/Fly.io)

1. Set environment variables in your deployment platform
2. Ensure `DATABASE_URL` points to your Neon database
3. Set `NODE_ENV=production`
4. Run: `npm run build && npm run start:prod`

### 9.2 Frontend Deployment (Vercel)

1. Connect your GitHub repository to Vercel
2. Set `NEXT_PUBLIC_API_URL` to your backend URL
3. Deploy

### 9.3 E2E Tests (CI/CD)

```bash
cd e2e
npm install
npx playwright install chromium
npm test
```

## 10. Troubleshooting

**Database connection issues:**
- Verify `DATABASE_URL` format: `postgresql://user:pass@host:port/db?sslmode=require`
- Ensure Neon database is active

**Google OAuth not working:**
- Verify OAuth credentials in Google Cloud Console
- Check callback URL matches exactly

**Rate limiting errors (429):**
- Wait 60 seconds or adjust `ThrottlerModule` config

---

For detailed API documentation, see `contracts/auth.yaml`.
