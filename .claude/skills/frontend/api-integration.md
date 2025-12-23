# API Integration

## Description
Connects frontend to backend APIs with proper error handling, authentication, and type safety.

## Trigger
- API connection needed
- `/code service` command
- Frontend-backend integration

## Instructions

### Service File Location
```
frontend/src/services/
├── api.ts           # Base API client
├── authService.ts   # Auth endpoints
├── userService.ts   # User endpoints
└── index.ts
```

### Base API Client

```typescript
// services/api.ts
import { useAuthStore } from '@/stores/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface RequestConfig extends RequestInit {
  params?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = useAuthStore.getState().token;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(
        error.message || 'Request failed',
        response.status,
        error
      );
    }
    return response.json();
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (config?.params) {
      Object.entries(config.params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      ...config,
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = new ApiClient(API_URL);
```

### Service Pattern

```typescript
// services/authService.ts
import { api } from './api';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest
} from '@/types/auth';

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    return api.post<LoginResponse>('/auth/login', data);
  },

  async register(data: RegisterRequest): Promise<LoginResponse> {
    return api.post<LoginResponse>('/auth/register', data);
  },

  async logout(): Promise<void> {
    return api.post('/auth/logout');
  },

  async refreshToken(): Promise<{ accessToken: string }> {
    return api.post('/auth/refresh');
  },

  async getProfile(): Promise<User> {
    return api.get('/auth/profile');
  },
};
```

```typescript
// services/userService.ts
import { api } from './api';
import type { User, CreateUserDto, UpdateUserDto } from '@/types/user';

export const userService = {
  async getAll(params?: { page?: number; limit?: number }): Promise<User[]> {
    return api.get('/users', { params: params as Record<string, string> });
  },

  async getById(id: string): Promise<User> {
    return api.get(`/users/${id}`);
  },

  async create(data: CreateUserDto): Promise<User> {
    return api.post('/users', data);
  },

  async update(id: string, data: UpdateUserDto): Promise<User> {
    return api.put(`/users/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return api.delete(`/users/${id}`);
  },
};
```

### Usage in Components

```typescript
// With React Query
import { useQuery, useMutation } from '@tanstack/react-query';
import { authService } from '@/services/authService';

function LoginForm() {
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Handle success
    },
    onError: (error) => {
      // Handle error
    },
  });

  const handleSubmit = (data: LoginRequest) => {
    loginMutation.mutate(data);
  };
}
```

### Export Pattern

```typescript
// services/index.ts
export { api, ApiError } from './api';
export { authService } from './authService';
export { userService } from './userService';
```

## Tools Used
- `Read`: Read API contracts
- `Write`: Create service files
- `Edit`: Modify services

## Best Practices
- Type all requests/responses
- Handle errors consistently
- Use interceptors for auth
- Centralize API configuration
