# Tailwind Styler

## Description
Applies Tailwind CSS styling to components following design system conventions and best practices.

## Trigger
- Styling needed
- `/style` command
- Component styling task

## Instructions

### Utility Function

```typescript
// lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Common Patterns

#### Layout
```tsx
// Centering
<div className="flex items-center justify-center">

// Container
<div className="container mx-auto px-4">

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Stack (vertical)
<div className="flex flex-col space-y-4">

// Stack (horizontal)
<div className="flex items-center space-x-4">
```

#### Spacing
```tsx
// Padding
<div className="p-4">      // all sides
<div className="px-4 py-2"> // horizontal/vertical
<div className="pt-4">      // top only

// Margin
<div className="m-4">       // all sides
<div className="mx-auto">   // center horizontally
<div className="mt-8 mb-4"> // top and bottom
```

#### Typography
```tsx
// Headings
<h1 className="text-3xl font-bold">
<h2 className="text-2xl font-semibold">
<h3 className="text-xl font-medium">

// Body
<p className="text-base text-gray-600">
<p className="text-sm text-gray-500">

// Links
<a className="text-blue-600 hover:text-blue-800 hover:underline">
```

#### Colors
```tsx
// Background
<div className="bg-white">
<div className="bg-gray-100">
<div className="bg-blue-600">

// Text
<p className="text-gray-900">    // dark
<p className="text-gray-600">    // medium
<p className="text-gray-400">    // light

// Border
<div className="border border-gray-200">
<div className="border-l-4 border-blue-500">
```

#### Effects
```tsx
// Shadow
<div className="shadow-sm">
<div className="shadow-md">
<div className="shadow-lg">

// Rounded
<div className="rounded">       // small
<div className="rounded-md">    // medium
<div className="rounded-lg">    // large
<div className="rounded-full">  // circle

// Transitions
<button className="transition-colors duration-200">
<div className="transition-transform hover:scale-105">
```

#### States
```tsx
// Hover
<button className="hover:bg-blue-700">
<a className="hover:underline">

// Focus
<input className="focus:outline-none focus:ring-2 focus:ring-blue-500">
<button className="focus:ring-2 focus:ring-offset-2">

// Disabled
<button className="disabled:opacity-50 disabled:cursor-not-allowed">

// Active
<button className="active:bg-blue-800">
```

### Component Styling Examples

#### Button Styles
```tsx
// Primary
className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"

// Secondary
className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"

// Outline
className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50"
```

#### Input Styles
```tsx
// Default
className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"

// Error
className="w-full px-3 py-2 border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
```

#### Card Styles
```tsx
className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
```

### Responsive Design

```tsx
// Mobile first
<div className="text-sm md:text-base lg:text-lg">

// Grid responsive
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

// Hide/show
<div className="hidden md:block">    // hide on mobile
<div className="block md:hidden">    // show only mobile

// Spacing responsive
<div className="p-4 md:p-6 lg:p-8">
```

### Dark Mode (if needed)

```tsx
<div className="bg-white dark:bg-gray-900">
<p className="text-gray-900 dark:text-gray-100">
<div className="border-gray-200 dark:border-gray-700">
```

## Tools Used
- `Read`: Read component code
- `Edit`: Apply styles

## Best Practices
- Use cn() for conditional classes
- Mobile-first responsive
- Consistent spacing scale
- Avoid arbitrary values
- Group related utilities
