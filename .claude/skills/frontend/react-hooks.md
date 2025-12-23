# React Hooks

## Description
Creates custom React hooks for shared logic, data fetching, and state management.

## Trigger
- Shared logic needed
- `/code hook` command
- Reusable functionality required

## Instructions

### Hook File Location
```
frontend/src/hooks/
├── useAuth.ts
├── useForm.ts
├── useApi.ts
└── index.ts
```

### Hook Naming Convention
```
use{Purpose}

Examples:
- useAuth
- useUser
- useForm
- useDebounce
- useLocalStorage
```

### Basic Hook Template

```typescript
// hooks/use{Name}.ts
import { useState, useEffect, useCallback } from 'react';

interface Use{Name}Options {
  // options
}

interface Use{Name}Return {
  // return type
}

export function use{Name}(options?: Use{Name}Options): Use{Name}Return {
  const [state, setState] = useState();

  useEffect(() => {
    // effect logic
  }, []);

  const action = useCallback(() => {
    // action logic
  }, []);

  return {
    state,
    action,
  };
}
```

### Common Hook Patterns

#### useAuth Hook
```typescript
// hooks/useAuth.ts
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const { user, token, setAuth, clearAuth } = useAuthStore();

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    setAuth(response.user, response.token);
    router.push('/dashboard');
  };

  const logout = () => {
    clearAuth();
    router.push('/login');
  };

  const isAuthenticated = !!token;

  return {
    user,
    isAuthenticated,
    login,
    logout,
  };
}
```

#### useApi Hook
```typescript
// hooks/useApi.ts
import { useState, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useApi<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await apiCall();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
      throw error;
    }
  }, []);

  return { ...state, execute };
}
```

#### useDebounce Hook
```typescript
// hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

#### useLocalStorage Hook
```typescript
// hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue] as const;
}
```

#### useForm Hook
```typescript
// hooks/useForm.ts
import { useState, useCallback } from 'react';

export function useForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return { values, errors, handleChange, setErrors, reset };
}
```

### Export Pattern

```typescript
// hooks/index.ts
export { useAuth } from './useAuth';
export { useApi } from './useApi';
export { useDebounce } from './useDebounce';
export { useLocalStorage } from './useLocalStorage';
export { useForm } from './useForm';
```

## Tools Used
- `Read`: Read existing hooks
- `Write`: Create hook files
- `Edit`: Modify hooks

## Best Practices
- Start with 'use' prefix
- Return object for multiple values
- Include TypeScript types
- Handle cleanup in useEffect
- Memoize callbacks
