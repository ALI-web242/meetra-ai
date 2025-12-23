# Next.js Coder

## Description
Implements Next.js pages, components, and routing using App Router conventions with TypeScript.

## Trigger
- Frontend implementation tasks
- `/code frontend` command
- Page/component creation needed

## Instructions

### Project Structure

```
frontend/src/
├── app/                    # App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── (auth)/            # Auth route group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   └── (dashboard)/       # Protected route group
│       └── layout.tsx
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   └── {feature}/        # Feature components
├── hooks/                # Custom hooks
├── services/             # API services
├── stores/               # Zustand stores
├── types/                # TypeScript types
└── lib/                  # Utilities
```

### Page Template

```typescript
// app/{route}/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
};

export default function PageName() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Page Title</h1>
      {/* Content */}
    </main>
  );
}
```

### Client Component Template

```typescript
// components/{feature}/{Component}.tsx
'use client';

import { useState } from 'react';

interface ComponentProps {
  // props
}

export function Component({ ...props }: ComponentProps) {
  const [state, setState] = useState();

  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Server Component Template

```typescript
// components/{feature}/{Component}.tsx
interface ComponentProps {
  // props
}

export async function Component({ ...props }: ComponentProps) {
  // Can use async/await directly
  const data = await fetchData();

  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Layout Template

```typescript
// app/{route}/layout.tsx
interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <header>{/* Header */}</header>
      <main>{children}</main>
      <footer>{/* Footer */}</footer>
    </div>
  );
}
```

### Loading & Error States

```typescript
// app/{route}/loading.tsx
export default function Loading() {
  return <div className="animate-pulse">Loading...</div>;
}

// app/{route}/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### Common Patterns

#### Protected Route
```typescript
// app/(protected)/layout.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return <>{children}</>;
}
```

#### Form with Server Action
```typescript
// app/contact/page.tsx
async function submitForm(formData: FormData) {
  'use server';
  // Handle form submission
}

export default function ContactPage() {
  return (
    <form action={submitForm}>
      <input name="email" type="email" required />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Tools Used
- `Read`: Read existing components
- `Write`: Create new files
- `Edit`: Modify existing files
- `Glob`: Find related files

## Best Practices
- Use App Router conventions
- Prefer Server Components
- Add 'use client' only when needed
- Include proper TypeScript types
- Add loading/error states
