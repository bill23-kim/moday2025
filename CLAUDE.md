# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a monorepo containing four interactive event/game applications, primarily for Korean-language events (행사용 앱):

| Project | Description | Tech Stack | Package Manager |
|---------|-------------|------------|-----------------|
| **multibuzzer/** | Real-time multiplayer buzzer system (200 players) | React 18 + boardgame.io + Koa | yarn |
| **quiz/** | Quiz board application | Next.js 16 + React 19 + shadcn/ui | pnpm |
| **luckydraw/** | Lucky draw/raffle with animated roulette (행운권 추첨) | Next.js 16 + React 19 + shadcn/ui | pnpm |
| **mongawi/** | Event application (v0.app generated) | Next.js 16 + React 19 + shadcn/ui | pnpm |

## Build Commands by Project

### Next.js Projects (quiz, luckydraw, mongawi)
```bash
cd <project>
pnpm install
pnpm dev      # Development server
pnpm build    # Production build
pnpm lint     # ESLint
pnpm start    # Production server
```

### Multibuzzer (React + boardgame.io)
```bash
cd multibuzzer
yarn install
yarn dev      # Client on :4000, server on :4001
yarn build    # Production build
yarn test     # React test runner
yarn start    # Production server (serves built app + boardgame.io)
```

### Adding shadcn/ui Components (Next.js projects)
```bash
npx shadcn@latest add <component-name>
```

## Architecture Notes

### Shared Patterns in Next.js Projects
- All use shadcn/ui (new-york style) with Radix UI primitives
- Tailwind CSS 4 with OKLCH color space for theming
- Path alias `@/*` maps to project root
- Dark theme by default
- Components in `components/ui/`, hooks in `hooks/`

### Multibuzzer Specifics
- boardgame.io manages game state via Socket.IO
- Game state in `src/lib/store.js`: `G.queue` (buzz timestamps), `G.locked` (buzzer lock)
- Host (lowest player ID) has admin controls: lock/reset buzzers
- Server endpoints in `src/lib/endpoints.js` call boardgame.io lobby API
- 6-character room codes (uppercase letters)
