# Type Generator

## Description
Generates TypeScript interfaces and types from API contracts and database schemas for type-safe development.

## Trigger
- After OpenAPI spec created
- After schemas designed
- `/contracts types` command

## Instructions

### Type File Locations
```
specs/{spec-id}/contracts/types/
frontend/src/types/
backend/src/{module}/dto/
```

### From OpenAPI to TypeScript

#### Request/Response Types
```typescript
// From OpenAPI schema
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  createdAt: string;
}

export type UserRole = 'admin' | 'user' | 'guest';
```

#### API Error Types
```typescript
export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  details?: Record<string, string[]>;
}
```

### From Entity to DTO

#### Create DTO
```typescript
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  name?: string;
}
```

#### Update DTO
```typescript
export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
```

#### Response DTO
```typescript
export class UserResponseDto {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  createdAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.role = user.role;
    this.createdAt = user.createdAt;
  }
}
```

### Shared Types Pattern

```typescript
// shared/types/api.ts
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
```

### Type Naming Conventions

| Purpose | Pattern | Example |
|---------|---------|---------|
| Request body | {Action}{Entity}Request | CreateUserRequest |
| Response | {Entity}Response | UserResponse |
| DTO | {Action}{Entity}Dto | CreateUserDto |
| Enum | {Entity}{Field} | UserRole |

## Tools Used
- `Read`: Read OpenAPI specs, entities
- `Write`: Create type files

## Best Practices
- Keep frontend and backend types in sync
- Use strict types, avoid `any`
- Export all types from index file
- Document complex types
