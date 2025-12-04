# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js 16 lucky draw (행운권 추첨) application built with React 19 and shadcn/ui components. The app randomly selects winners from a pool of participants with animated roulette-style display and sound effects.

## Build Commands

```bash
# Install dependencies (uses pnpm)
pnpm install

# Development server
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint
pnpm lint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **UI Components**: shadcn/ui (new-york style) with Radix UI primitives
- **Styling**: Tailwind CSS 4 with CSS variables for theming
- **Icons**: lucide-react
- **Analytics**: Vercel Analytics

### Directory Structure
```
app/
├── layout.tsx      # Root layout with Geist fonts and metadata
├── page.tsx        # Main lucky draw page (single-page app)
└── globals.css     # Tailwind config + Dracula-inspired dark theme

components/
├── ui/             # shadcn/ui components
└── theme-provider.tsx

hooks/              # Custom React hooks
lib/utils.ts        # cn() utility for className merging
```

### Key Implementation Details

**Main Page (`app/page.tsx`)**:
- Client component with Web Audio API for sound effects (tick/win sounds)
- Animated roulette using requestAnimationFrame with easing
- State management for participants, winners, and draw animation
- Korean language UI (참가자 = participants, 당첨자 = winners, 추첨 = draw)

**Theming**:
- Custom Dracula-inspired theme in `app/globals.css`
- Uses OKLCH color space for CSS variables
- Destructive color (red) used as accent throughout

**shadcn/ui Configuration** (`components.json`):
- Style: new-york
- RSC enabled
- Path aliases: `@/components`, `@/lib/utils`, `@/hooks`
