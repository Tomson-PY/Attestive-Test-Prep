# Attestiva Web Style Guide

This guide is the working visual standard for the marketing site in this repository.
It is intentionally opinionated: bold clarity over neutral templates.

## 1) Brand Direction

- Primary idea: move from checkbox compliance to verified understanding.
- Visual tone: confident, modern, high-contrast, audit-grade credibility.
- Design bias: large typography, strong hierarchy, clear data storytelling.

## 2) Core Design Tokens

Use existing tokens from `/Users/tomamon/Dev Projects/Attestiva Website/app/globals.css` as source of truth:

- `--color-accent`: `#D6FF0A` (high-energy highlight)
- `--color-accent-2`: `#00D37F` (success/progression)
- `--color-text-main`: `#1A1A1A` (primary text)
- `--color-bg-surface`: `#F8FAFB` (light surface)
- `--color-ink`: `#202225` (dark UI base)
- `--text-main`: `#1A1A1A`
- `--bg-surface`: `#F8FAFB`

## 3) Typography

From `/Users/tomamon/Dev Projects/Attestiva Website/app/layout.tsx`:

- Body font: `Inter` (`--font-inter`)
- Display font: `Plus Jakarta Sans` (`--font-jakarta`)

Recommended scale:

- Hero headline: `text-5xl` to `text-8xl`, `font-extrabold` or `font-black`
- Section headline: `text-4xl` to `text-6xl`, `font-black`
- Card/feature headline: `text-xl` to `text-3xl`, `font-bold`
- Body copy: `text-lg` to `text-2xl` for key messaging; avoid tiny explainer text in primary sections

## 4) Layout + Spacing

- Section rhythm: `py-24` to `py-28`
- Container width: `max-w-screen-xl`
- Horizontal padding: `px-6` (mobile through desktop baseline)
- Preferred pattern: one dominant idea per section, one visual anchor, one CTA path

## 5) Visual Patterns to Reuse

### A) Full-bleed Hero

- Large background image/video
- Dark overlay for legibility (`bg-black/30` to `bg-black/80` depending on image)
- Headline with one highlighted keyword via accent styling

### B) Glassmorphism Data Panel

Reference implementation:
`/Users/tomamon/Dev Projects/Attestiva Website/components/sections/ComprehensionLiftSection.tsx`

Recipe:

- Frosted panel: `bg-white/10` + `backdrop-blur-2xl` + subtle border (`border-white/25`)
- Atmospheric glow: large blurred radial accents behind panel in brand colors
- Data should be oversized and immediate (large percentages, thick bars, high contrast)
- Keep metric labels short and executive-readable

### C) Feature Cards

- Rounded cards (`rounded-2xl`)
- Subtle borders and hover depth
- Accent gradients for emphasis lines and icon treatments
- Motion should support comprehension, not distract from content

## 6) Motion Guidelines

- Base transitions: `0.5s` to `0.85s`
- Easing: `easeOut` or cubic-bezier `[0.23, 1, 0.32, 1]`
- Use stagger for readability when introducing multiple elements
- Prefer meaningful movement:
  - reveal content hierarchy
  - draw attention to primary metric
  - reinforce directional flow (e.g., low -> high performance)

## 7) Chart and Data Storytelling Rules

- Always show the benchmark vs Attestiva in one glance
- Minimum visual standards:
  - large labels (`text-xl+`)
  - large values (`text-4xl+`)
  - bars at least `h-6`
- Do not hide key data in paragraph copy
- Present percentages directly inside or adjacent to chart rows
- Supporting copy should explain *why* the delta exists (teaching + proficiency checkpoint)

## 8) Copy Voice for Design Sections

- Direct, concrete, operational
- Preferred contrast framing:
  - "delivery" vs "understanding"
  - "acknowledgment" vs "capability"
  - "checkbox" vs "auditable comprehension"
- Keep sentences short and high-impact in primary areas

## 9) Accessibility Baseline

- Maintain readable contrast in overlays and glass panels
- Do not rely on color alone; include icon/label/value text
- Preserve keyboard focus and semantic heading order
- Respect reduced motion where practical for non-essential animation

## 10) Build Checklist for New Sections

Before merging any new design section:

1. Uses brand tokens from `globals.css`, no random palette drift.
2. Maintains bold typography hierarchy and avoids small unreadable text.
3. Includes a clear visual anchor (image, chart, or proof metric).
4. Matches existing spacing rhythm and container widths.
5. Adds motion with purpose (not decorative noise only).
6. Mobile layout is legible without content compression.

## 11) Should This Be a Skill?

Yes, if you want repeatable design output from Codex with less back-and-forth.

Best approach:

1. Keep this file as the canonical style reference in-repo.
2. Create a lightweight skill (e.g., `attestiva-section-designer`) that tells Codex to:
   - read this guide first
   - reuse existing section patterns
   - enforce bold typography + clear data storytelling
   - avoid generic/default layouts
3. Include a small section blueprint template in that skill for faster implementation.

