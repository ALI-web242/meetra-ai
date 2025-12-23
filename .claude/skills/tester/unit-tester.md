# Unit Tester

## Description
Writes Jest unit tests for functions, components, and services with proper mocking and assertions.

## Trigger
- Unit tests needed
- `/test unit` command
- Testing task

## Instructions

### Test File Location

```
# Backend
backend/src/{module}/*.spec.ts
backend/src/{module}/__tests__/*.spec.ts

# Frontend
frontend/src/components/__tests__/*.test.tsx
frontend/src/hooks/__tests__/*.test.ts
frontend/tests/unit/*.test.ts
```

### Test File Naming
```
{name}.spec.ts    # Backend (NestJS convention)
{name}.test.ts    # Frontend
{name}.test.tsx   # React components
```

### Basic Test Structure

```typescript
// {module}.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [{ id: '1', email: 'test@test.com' }];
      mockRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = { id: '1', email: 'test@test.com' };
      mockRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne('1');

      expect(result).toEqual(user);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });
});
```

### React Component Testing

```typescript
// components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../ui/Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when loading', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies variant classes', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-600');
  });
});
```

### Hook Testing

```typescript
// hooks/__tests__/useAuth.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';

// Mock dependencies
jest.mock('@/stores/authStore', () => ({
  useAuthStore: jest.fn(() => ({
    user: null,
    token: null,
    setAuth: jest.fn(),
    clearAuth: jest.fn(),
  })),
}));

describe('useAuth', () => {
  it('returns isAuthenticated false when no token', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('calls login and redirects on success', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('test@test.com', 'password');
    });

    // Assert login was called
  });
});
```

### Common Patterns

#### Mocking
```typescript
// Mock module
jest.mock('@/services/authService', () => ({
  authService: {
    login: jest.fn(),
    logout: jest.fn(),
  },
}));

// Mock implementation
const mockLogin = authService.login as jest.Mock;
mockLogin.mockResolvedValue({ user: {}, token: 'token' });

// Mock return value once
mockLogin.mockResolvedValueOnce({ error: 'Invalid' });

// Spy on method
const spy = jest.spyOn(service, 'method');
expect(spy).toHaveBeenCalledWith('arg');
```

#### Async Testing
```typescript
// Wait for async
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// findBy (automatically waits)
const element = await screen.findByText('Loaded');
```

#### Test Organization
```typescript
describe('AuthService', () => {
  describe('login', () => {
    describe('with valid credentials', () => {
      it('should return tokens', async () => {});
      it('should set user in store', async () => {});
    });

    describe('with invalid credentials', () => {
      it('should throw UnauthorizedException', async () => {});
    });
  });
});
```

### Test Coverage

```bash
# Run with coverage
npm run test:cov

# Coverage thresholds (jest.config.js)
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
},
```

## Tools Used
- `Read`: Read source code
- `Write`: Create test files
- `Bash`: Run tests

## Best Practices
- Test behavior, not implementation
- One assertion per test (when possible)
- Use descriptive test names
- Mock external dependencies
- Test edge cases and errors
