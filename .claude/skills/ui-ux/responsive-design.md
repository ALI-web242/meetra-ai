# Responsive Design

## Description
Ensures components and layouts work correctly across all screen sizes using mobile-first approach.

## Trigger
- Layout implementation
- `/responsive` command
- Mobile optimization needed

## Instructions

### Breakpoints

| Breakpoint | Min Width | Prefix | Common Devices |
|------------|-----------|--------|----------------|
| Default | 0px | (none) | Mobile phones |
| sm | 640px | sm: | Large phones |
| md | 768px | md: | Tablets |
| lg | 1024px | lg: | Laptops |
| xl | 1280px | xl: | Desktops |
| 2xl | 1536px | 2xl: | Large screens |

### Mobile-First Approach

```tsx
// Wrong: Desktop first
className="text-lg sm:text-base"

// Correct: Mobile first
className="text-base lg:text-lg"
```

### Common Responsive Patterns

#### Navigation
```tsx
// Mobile: hamburger menu, Desktop: full nav
<nav className="relative">
  {/* Mobile menu button */}
  <button className="md:hidden">
    <MenuIcon />
  </button>

  {/* Desktop nav */}
  <div className="hidden md:flex md:items-center md:space-x-4">
    <a href="#">Home</a>
    <a href="#">About</a>
    <a href="#">Contact</a>
  </div>

  {/* Mobile nav (toggled) */}
  <div className="absolute top-full left-0 w-full md:hidden">
    {/* Mobile menu items */}
  </div>
</nav>
```

#### Grid Layout
```tsx
// 1 col mobile, 2 col tablet, 3 col desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => (
    <Card key={item.id}>{item.name}</Card>
  ))}
</div>

// Sidebar layout
<div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
  <aside className="hidden lg:block">Sidebar</aside>
  <main>Content</main>
</div>
```

#### Typography
```tsx
// Responsive text sizes
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Heading
</h1>

<p className="text-sm md:text-base">
  Body text that scales with screen size.
</p>
```

#### Spacing
```tsx
// Responsive padding
<div className="p-4 md:p-6 lg:p-8">

// Responsive margin
<section className="my-8 md:my-12 lg:my-16">

// Responsive gap
<div className="flex flex-col gap-4 md:gap-6">
```

#### Images
```tsx
// Responsive image
<img
  src="/image.jpg"
  alt="Description"
  className="w-full h-48 md:h-64 lg:h-80 object-cover"
/>

// Aspect ratio
<div className="aspect-video md:aspect-square lg:aspect-[4/3]">
  <img className="w-full h-full object-cover" />
</div>
```

#### Flexbox Direction
```tsx
// Stack on mobile, row on desktop
<div className="flex flex-col md:flex-row md:items-center gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

#### Hide/Show Elements
```tsx
// Show only on mobile
<div className="block md:hidden">Mobile only</div>

// Show only on desktop
<div className="hidden md:block">Desktop only</div>

// Show on tablet and up
<div className="hidden sm:block">Tablet+</div>
```

### Responsive Component Example

```tsx
// components/Hero.tsx
export function Hero() {
  return (
    <section className="
      px-4 py-12
      md:px-6 md:py-16
      lg:px-8 lg:py-24
    ">
      <div className="
        max-w-7xl mx-auto
        flex flex-col items-center text-center
        lg:flex-row lg:text-left lg:justify-between
      ">
        {/* Content */}
        <div className="lg:w-1/2 lg:pr-8">
          <h1 className="
            text-3xl font-bold
            md:text-4xl
            lg:text-5xl
          ">
            Welcome to Our Platform
          </h1>
          <p className="
            mt-4 text-gray-600
            text-base
            md:text-lg
          ">
            Description text that provides more information.
          </p>
          <div className="
            mt-6
            flex flex-col space-y-3
            sm:flex-row sm:space-y-0 sm:space-x-3
          ">
            <Button size="lg">Get Started</Button>
            <Button variant="outline" size="lg">Learn More</Button>
          </div>
        </div>

        {/* Image */}
        <div className="
          mt-8 lg:mt-0
          lg:w-1/2
        ">
          <img
            src="/hero.png"
            alt="Hero"
            className="w-full max-w-lg mx-auto"
          />
        </div>
      </div>
    </section>
  );
}
```

### Testing Responsive Design

1. Use browser DevTools device toolbar
2. Test at each breakpoint
3. Check touch targets (min 44x44px)
4. Verify text readability
5. Test navigation on mobile

## Tools Used
- `Read`: Read component code
- `Edit`: Add responsive classes

## Best Practices
- Always mobile-first
- Test on real devices
- Ensure touch-friendly
- Keep content readable
- Maintain visual hierarchy
