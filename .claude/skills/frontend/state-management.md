# State Management

## Description
Implements client-side state management using Zustand for global state and React Query for server state.

## Trigger
- Global state needed
- `/code store` command
- State management task

## Instructions

### Store File Location
```
frontend/src/stores/
├── authStore.ts
├── uiStore.ts
└── index.ts
```

### Zustand Store Template

```typescript
// stores/{name}Store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface {Name}State {
  // state
  value: string;
  items: Item[];
}

interface {Name}Actions {
  // actions
  setValue: (value: string) => void;
  addItem: (item: Item) => void;
  reset: () => void;
}

type {Name}Store = {Name}State & {Name}Actions;

const initialState: {Name}State = {
  value: '',
  items: [],
};

export const use{Name}Store = create<{Name}Store>()(
  persist(
    (set) => ({
      ...initialState,

      setValue: (value) => set({ value }),

      addItem: (item) => set((state) => ({
        items: [...state.items, item],
      })),

      reset: () => set(initialState),
    }),
    {
      name: '{name}-storage',
    }
  )
);
```

### Common Store Patterns

#### Auth Store
```typescript
// stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => set({
        user,
        token,
        isAuthenticated: true,
      }),

      clearAuth: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
      }),

      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
      })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);
```

#### UI Store
```typescript
// stores/uiStore.ts
import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
}

interface UIActions {
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
}

export const useUIStore = create<UIState & UIActions>((set) => ({
  sidebarOpen: true,
  theme: 'light',
  notifications: [],

  toggleSidebar: () => set((state) => ({
    sidebarOpen: !state.sidebarOpen,
  })),

  setTheme: (theme) => set({ theme }),

  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, notification],
  })),

  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id),
  })),
}));
```

### React Query for Server State

```typescript
// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/userService';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userService.getById(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
```

### Store Usage

```typescript
// In component
'use client';

import { useAuthStore } from '@/stores/authStore';

export function UserMenu() {
  const { user, clearAuth } = useAuthStore();

  return (
    <div>
      <span>{user?.name}</span>
      <button onClick={clearAuth}>Logout</button>
    </div>
  );
}
```

## Tools Used
- `Read`: Read existing stores
- `Write`: Create store files
- `Edit`: Modify stores

## Best Practices
- Separate UI state from server state
- Use persist for auth/preferences
- Keep stores focused
- Use selectors for performance
