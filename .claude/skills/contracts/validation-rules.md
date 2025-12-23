# Validation Rules

## Description
Creates Zod validation schemas for type-safe runtime validation on both frontend and backend.

## Trigger
- After types generated
- `/contracts validation` command
- Form validation needed

## Instructions

### Validation File Locations
```
frontend/src/validations/
backend/src/{module}/validations/
specs/{spec-id}/contracts/validations/
```

### Zod Schema Patterns

#### Basic Schema
```typescript
import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
  name: z.string().min(2).max(100).optional(),
});

export type UserInput = z.infer<typeof userSchema>;
```

#### Common Validations

```typescript
// Email
email: z.string().email('Invalid email address')

// Password
password: z
  .string()
  .min(8, 'Minimum 8 characters')
  .regex(/[A-Z]/, 'Must contain uppercase')
  .regex(/[0-9]/, 'Must contain number')

// UUID
id: z.string().uuid('Invalid ID')

// URL
website: z.string().url('Invalid URL').optional()

// Phone
phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone')

// Date
birthDate: z.coerce.date().max(new Date(), 'Cannot be future')

// Enum
role: z.enum(['admin', 'user', 'guest'])

// Number
age: z.number().int().min(0).max(150)

// Array
tags: z.array(z.string()).min(1).max(10)

// Object
address: z.object({
  street: z.string(),
  city: z.string(),
  zip: z.string(),
})
```

#### Form Schemas

```typescript
// Login
export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

// Register
export const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'Minimum 8 characters'),
  confirmPassword: z.string(),
  name: z.string().min(2, 'Name required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Update Profile
export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  avatar: z.string().url().optional(),
});
```

#### API Request Schemas

```typescript
// Pagination
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Search/Filter
export const searchSchema = z.object({
  query: z.string().min(1).optional(),
  filters: z.record(z.string()).optional(),
});
```

### NestJS Integration

```typescript
// In DTO
import { createZodDto } from 'nestjs-zod';

export class CreateUserDto extends createZodDto(createUserSchema) {}

// In Controller
@Post()
async create(@Body() dto: CreateUserDto) {
  // dto is validated
}
```

### React Hook Form Integration

```typescript
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const form = useForm<LoginInput>({
  resolver: zodResolver(loginSchema),
});
```

## Tools Used
- `Read`: Read type definitions
- `Write`: Create validation files

## Best Practices
- Keep schemas close to usage
- Reuse common patterns
- Provide helpful error messages
- Sync with API contracts
