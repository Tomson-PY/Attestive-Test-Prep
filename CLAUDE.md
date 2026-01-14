# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start dev server (kill existing process on port 3000 first)
lsof -ti:3000 | xargs kill -9 2>/dev/null; npm run dev

# Build for production
npm run build

# Run production server
npm start

# Run linter
npm run lint
```

Dev server runs at http://localhost:3000

## Architecture

This is a Next.js 16 App Router project for the Attestiva compliance platform marketing site.

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4 with custom theme variables
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Inter (body via `--font-sans`) and Plus Jakarta Sans (headings via `--font-display`)

### Project Structure
- `app/page.tsx` - Homepage composing all section components
- `app/layout.tsx` - Root layout with font configuration and metadata
- `app/globals.css` - Tailwind v4 theme config with brand colors
- `components/` - Page section components (Header, Hero, FeatureGrid, etc.)
- `lib/utils.ts` - `cn()` helper for conditional Tailwind classes

### Theme Colors
Defined in `globals.css` using Tailwind v4 `@theme`:
- `--color-accent`: #D6FF0A (lime green)
- `--color-accent-2`: #00D37F (emerald)
- `--color-bg-surface`: #F8FAFB
- `--color-text-main`: #1A1A1A

### Utility Pattern
Use the `cn()` function from `lib/utils.ts` for merging Tailwind classes:
```tsx
import { cn } from "@/lib/utils";
cn("base-class", conditional && "conditional-class")
```
