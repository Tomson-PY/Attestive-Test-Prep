# Agent Instructions for Attestiva Website

This file provides guidance to AI agents (Cursor, Claude, etc.) when working with code in this repository.

## Codex Skill Routing

- Primary design skill for this repo: `$attestive-test-prep-section-designer`
- Skill file path: `/Users/tomamon/.codex/skills/attestive-test-prep-section-designer/SKILL.md`
- Keep this separate from the compliance skill (`attestiva-section-designer`) to avoid cross-project drift.


## Critical: Development Server Management

**ALWAYS use this command to start the dev server:**
```bash
lsof -ti:3000 | xargs kill -9 2>/dev/null; npm run dev
```

This ensures any existing process on port 3000 is killed before starting a new one, preventing "port already in use" errors.

**Other commands:**
```bash
npm run build    # Build for production
npm start        # Run production server
npm run lint     # Run linter
```

Dev server runs at: `http://localhost:3000`

## Project Overview

**Purpose**: Marketing website for Attestiva - a compliance platform that transforms policies into verified competence with AI-powered assessments.

**Framework**: Next.js 16 with App Router

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4 with custom theme variables
- **Animations**: Framer Motion (scroll animations, parallax, hover effects)
- **Icons**: Lucide React
- **Fonts**: 
  - Inter (body text via `--font-sans`)
  - Plus Jakarta Sans (headings via `--font-display`)

## Project Structure

```
app/
  ├── page.tsx          # Homepage - composes all section components
  ├── layout.tsx        # Root layout with font config and metadata
  └── globals.css       # Tailwind v4 theme config with brand colors

components/
  ├── Header.tsx        # Site header/navigation
  ├── Footer.tsx        # Site footer
  ├── HeroAttestiva.tsx # Main hero section
  ├── FeatureGrid.tsx   # Feature grid display
  ├── PricingSection.tsx
  ├── ValueCarousel.tsx
  └── sections/
      ├── GreenGradientHero.tsx      # Hero with gradient background
      ├── LegalHandOffSection.tsx
      └── TestimonialSection/

public/images/         # Static assets served from /images/ path

lib/
  └── utils.ts         # cn() helper for conditional Tailwind classes
```

## Brand Colors & Theme

Defined in `app/globals.css` using Tailwind v4 `@theme`:

- **Primary Accent**: `#D6FF0A` (lime green) - Use for CTAs, highlights
- **Secondary Accent**: `#00D37F` (emerald) - Use sparingly
- **Background**: `#F8FAFB` - Light surface color
- **Text Main**: `#1A1A1A` - Primary text color
- **Dark BG**: `#1A1A1A` - For dark sections/buttons

## Coding Patterns

### Tailwind Class Merging
Always use the `cn()` utility from `lib/utils.ts`:
```tsx
import { cn } from "@/lib/utils";

<div className={cn(
  "base-class",
  conditional && "conditional-class",
  props.className
)} />
```

### Framer Motion Animations
Common patterns used throughout:
```tsx
// Entrance animations
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.7 }}
/>

// Parallax scroll
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ["start start", "end start"]
});
const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

// Hover interactions
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.98 }}
/>
```

### Next.js Image Optimization
```tsx
import Image from "next/image";

<Image
  src="/images/filename.png"
  alt="Descriptive alt text"
  width={400}
  height={300}
  priority  // Use for above-the-fold images
  className="w-full h-auto"
/>
```

## Important Notes

### Static Assets
- All images must be in `public/images/` to be served from `/images/` path
- Next.js automatically optimizes images and serves WebP to compatible browsers
- Use descriptive filenames (kebab-case preferred)

### Animations
- Use `viewport={{ once: true }}` for entrance animations to prevent re-triggering
- Keep animation durations between 0.4s - 0.8s for snappiness
- Use easing curves: `ease: "easeOut"` or `ease: [0.23, 1, 0.32, 1]`

### Responsive Design
- Mobile-first approach
- Use Tailwind breakpoints: `sm:` `md:` `lg:` `xl:`
- Test all breakpoints when making layout changes

### Performance
- Use `priority` prop on above-the-fold images
- Lazy load below-the-fold content
- Keep bundle size small - avoid unnecessary dependencies

## Common Tasks

### Adding New Images
1. Place in `public/images/` folder
2. Use descriptive kebab-case filename
3. Reference as `/images/filename.ext` in code
4. Specify width/height for optimal loading

### Restarting Dev Server After Changes
```bash
lsof -ti:3000 | xargs kill -9 2>/dev/null; npm run dev
```

### Checking for Errors
- Check browser console for runtime errors
- Run `npm run lint` for linting issues
- Verify no TypeScript errors in editor

## Git Workflow

- Keep commits atomic and descriptive
- Test changes before committing
- Check `git status` to avoid committing unwanted files

## Recent Maintenance Notes

### Testimonial marquee stability (2026-02-06)
- Issue observed: testimonial row could stop appearing to animate after navigating away from home (for example `/contact`) and returning via the logo link.
- Current fix in `components/sections/TestimonialSection/index.tsx`:
  - marquee rendering no longer depends on section `useScroll`/`useTransform` opacity-parallax coupling.
  - marquee track uses `w-max` and `willChange: "transform"` to keep transform animation consistent.
  - shared `layoutId` transitions were removed from duplicated testimonial cards/overlay to prevent motion state conflicts.
- Current speed is set in `rowConfigs` with `duration: 40` (seconds). Adjust this value to speed up or slow down the loop.
