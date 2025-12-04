# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## Architecture

This is a Next.js 16 application with React 19 and Tailwind CSS 4, bootstrapped from v0.app.

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **UI Components**: shadcn/ui (new-york style) with Radix UI primitives
- **Styling**: Tailwind CSS 4 with CSS variables for theming (oklch color space)
- **Forms**: react-hook-form with zod validation
- **Icons**: lucide-react

### Project Structure
```
app/           # Next.js App Router pages and layouts
components/
  ui/          # shadcn/ui components (57 components)
  theme-provider.tsx
hooks/         # Custom React hooks (use-mobile, use-toast)
lib/
  utils.ts     # cn() utility for Tailwind class merging
styles/        # Additional global styles
public/        # Static assets and images
```

### Path Aliases
Uses `@/*` alias mapping to project root (configured in tsconfig.json).

### Key Patterns
- Components use `"use client"` directive for client-side interactivity
- shadcn/ui components are in `components/ui/` and can be customized directly
- Global CSS variables defined in `app/globals.css` using oklch color format
- Custom animations (firework, float, spin variants) defined in globals.css

### Adding shadcn/ui Components
```bash
npx shadcn@latest add <component-name>
```
Component configuration is in `components.json`.
