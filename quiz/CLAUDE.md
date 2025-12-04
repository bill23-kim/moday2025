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

# Run linting
pnpm lint

# Start production server
pnpm start
```

## Architecture

This is a Next.js 16 quiz application built with React 19, Tailwind CSS 4, and shadcn/ui components (new-york style).

### Key Files

- `app/page.tsx` - Main quiz board component with all game logic (team management, quiz selection, scoring)
- `app/layout.tsx` - Root layout with Geist fonts and Vercel Analytics
- `app/globals.css` - Theme configuration using OKLCH color space with CSS variables
- `components.json` - shadcn/ui configuration (new-york style, RSC enabled)

### UI Component Library

Uses shadcn/ui with Radix UI primitives. Components are located in `components/ui/` and can be added via:
```bash
npx shadcn@latest add <component-name>
```

### Path Aliases

`@/*` maps to the project root (configured in tsconfig.json).

### Styling

- Tailwind CSS 4 with `tw-animate-css` for animations
- Dark theme by default (both `:root` and `.dark` use dark color scheme)
- OKLCH color functions for better color manipulation
