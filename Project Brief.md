# Interaction Showcase – Project Brief

## Overview
A portfolio of polished, interactive UI components and patterns built with React and TypeScript. Each component is showcased as a "playground" piece—preview in centre viewport, click to expand full-screen modal, click out to return.

The site also features a hidden design system Easter egg that displays all tokens (colours, typography, spacing, border radius) used throughout the project.

## Core Concept
**"Digital playground"** – A curated gallery of interaction moments. Not a component library, not case studies. Just clean, crafted UI moments you can click into and explore.

## Navigation Model
- **Primary:** Click preview card → full-screen modal → interact → close modal → back to gallery
- **Secondary (future):** Hover section title (e.g., "Digital playground") to expose parent pages (Home, About, Contact, etc.)
- **Easter egg:** Hidden icon somewhere on the page that reveals the design system (tokens explorer)

## Layout Structure

### Desktop
- **Header:** "TOM" (left), "WINTER" (right)
- **Left sidebar:** Vertical centred text showing section title (e.g., "Digital playground")
- **Centre:** Feature preview area (large, rounded container)
- **Right sidebar:** Pagination indicators (vertical line segments)
- **Below feature:** Title and subtitle of current component
- **Hidden:** Design system toggle/icon somewhere in the layout

### Mobile
- **Header:** "TOM" and "WINTER" adapted for mobile spacing
- **Section title:** Integrated into top area or below header
- **Feature area:** Full width, responsive
- **Pagination:** Bottom of page (horizontal dots or similar)
- **Title/subtitle:** Below feature

## Design Tokens

### Colours
- **Primary (dark black):** `#080708`
- **Neutral (light grey, background):** `#E6E8E6`
- **Accent (internet blue):** `#0000FF`
- **White:** `#FFFFFF`

### Typography
All text levels (xs, sm, base, lg) support both **regular (400)** and **semibold (600)** weights.
- **xs:** 13px
- **sm:** 15px
- **base:** 17px
- **lg:** 21px
- **Font family:** System sans (`system-ui, -apple-system, sans-serif`)
- **Line height:** Auto

### Spacing System
`[0, 2, 4, 8, 16, 20, 24, 32, 64]` (indexed 0–8)

### Border Radius
To be defined.

## Design System Easter Egg
A hidden page (triggered by a small icon/button) that displays:
- All colours with hex values
- Typography styles (sizes, weights, line heights)
- Spacing scale
- Border radius values
- Any other foundational tokens

This page is **live-updated** as new tokens are added to the system. Single source of truth: `tokens.ts`.

## Tech Stack
- **Framework:** React + TypeScript
- **Styling:** CSS + CSS variables for tokens
- **Tokens:** Centralized `tokens.ts` file (exported for both component use and design system page)
- **Build:** Vite
- **Deployment:** Vercel

## Current Phase: Foundation
Build the skeleton/layout with:
- One placeholder feature preview (no interaction yet, just visual)
- Layout responsive on desktop and mobile
- Navigation structure in place (but non-functional for now)
- Tokens system set up and integrated
- Design system page scaffolded
- All type levels available in both regular and semibold

## Future Phases
- Add 5–8 actual interactive components
- Implement modal interaction and navigation
- Build design system explorer with live token display
- Add section/page navigation (hover to reveal)
- Define and integrate border radius
- Deploy to Vercel

## File Structure (Expected)
src/
components/
Header.tsx
SidebarLeft.tsx
SidebarRight.tsx
FeaturePreview.tsx
Modal.tsx
DesignSystemPage.tsx
pages/
Playground.tsx
DesignSystem.tsx (hidden Easter egg)
styles/
tokens.ts (single source of truth)
globals.css
layout.css
App.tsx
main.tsx
public/
package.json
vite.config.ts

## Notes
- Keep styling minimal and clean (no unnecessary decoration)
- Focus on layout and responsive behaviour first
- Design system page is core to the project—build with this in mind from day one
- Interaction polish comes later; skeleton and structure first
- Every typography level supports both regular and semibold weights