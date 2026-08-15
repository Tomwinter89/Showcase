# Portfolio – Interaction Showcase

## Project overview
A curated gallery of polished, interactive UI components ("Digital playground").  
Each component is showcased as a full-viewport card; click to expand, click out to close.  
There is a hidden Design System explorer page accessible via Tab focus or Cmd+Shift+D.

## Tech stack
- Vite 6 + React 18 + TypeScript
- Plain CSS + CSS custom properties (no external UI libraries)
- Mobile-first responsive design
- Deployment: Vercel (future)

## Design tokens (locked)
Single source of truth: `src/styles/tokens.ts`  
CSS variables exposed in: `src/styles/globals.css`

Token architecture is **layered**: `tokens.ts` primitive values → `--primitive-*` CSS vars → semantic CSS vars (`--surface-*`, `--btn-primary-*`) → component CSS classes. Component CSS uses only semantic vars — zero raw values.

| Token | Value |
|---|---|
| `--color-primary` | `#080708` dark black |
| `--color-neutral` | `#E6E8E6` light grey / page background |
| `--color-accent` | `#0000FF` internet blue |
| `--color-white` | `#FFFFFF` |
| `--color-secondary` | `rgba(8,7,8,0.6)` primary at 60% alpha — body copy, labels |
| `--color-border` | `rgba(8,7,8,0.1)` card strokes, subtle borders |
| `--color-muted` | `rgba(8,7,8,0.3)` inactive indicators |
| `--color-danger` | `#D92D20` destructive actions — remove, delete |
| Font sizes | xxs 11px / xs 13px / sm 15px / base 17px / lg 21px / display 96px |
| Weights | regular 400 / medium 500 / semibold 600 |
| Spacing | [0,2,4,8,16,20,24,32,64] indexed 0–8 |
| Border radius | indicator 2px / inset 4px / row 12px / tile 16px / panel 20px / cardInset 24px / card 32px / button 999px |
| Shadows | `--shadow-surface` (drop-shadow) / `--shadow-button` (elevation) |
| Line height | tight 1.05 / snug 1.2 / base 1.4 / relaxed 1.65 |
| Letter spacing | tight −0.02em / none / wide 0.08em |
| Motion durations | fast 150ms / base 280ms / slow 500ms |
| Motion easings | standard / enter / exit / spring (cubic-bezier) |

**Border radius naming convention:** semantic — describes WHERE used, not size. Never add a new radius token without a named use case.  
**Shadow naming convention:** semantic — `surface` for elevated surfaces, `button` for interactive elements.

## Folder structure
```
src/
  components/
    Button.tsx / .css          ← primary pill button; uses --btn-primary-* semantic vars
    Header.tsx / .css
    Layout.tsx / .css
    ProductCard.tsx / .css     ← part of Sheet Stacking demo
    Sheet.tsx / .css           ← portal-based, focus-trapped, depth-registered
    SheetStackingDemo.tsx / .css
    SidebarLeft.tsx / .css
    SidebarRight.tsx / .css
    FeaturePreview.tsx / .css  ← uses .raised-surface class
  data/
    features.ts                ← shared Feature data (id, title, subtitle)
  pages/
    Playground.tsx / .css
    DesignSystem.tsx / .css
    FeaturePage.tsx / .css     ← article page per feature
  utils/
    navigation.ts              ← View Transitions API crossfade wrapper
  styles/
    tokens.ts                  ← single source of truth
    globals.css                ← CSS variables + reset + primitive/semantic tokens
    surfaces.css               ← .raised-surface / .raised-surface--2 classes
  App.tsx
  main.tsx
vercel.json                    ← SPA rewrite rule
```

## Design System easter egg
- Visually hidden `<a>` in the header – becomes visible when focused via Tab
- Keyboard shortcut: `Cmd+Shift+D` (Mac) / `Ctrl+Shift+D` (Win/Linux)
- `Escape` returns to the playground

---

## Session log

### Session 1 – 2026-06-19 · Foundation
**Goal:** Bootstrap the entire project from scratch.  
**Completed:**
- Vite + React 18 + TypeScript scaffolded
- `tokens.ts` with colours, typography (4 scales × 2 weights), spacing, font family
- `globals.css` with CSS custom properties, reset, base styles
- `Header` — sticky, TOM/WINTER, hidden DS easter-egg link (tab-focusable)
- `SidebarLeft` — vertical "Digital playground" label
- `SidebarRight` — 8 pagination segments (vertical desktop / horizontal mobile)
- `FeaturePreview` — large rounded card + title/subtitle footer
- `Layout` — three-column desktop, single-column mobile
- `Playground` page (1 hardcoded feature: "Sheet stacking")
- `DesignSystem` page (colours, typography, spacing, border-radius stub)
- `App.tsx` — page state, keyboard shortcut, DS toggle
- Dev server running at http://localhost:5173

**Next phase:**
- Add real interactive components (target: 5–8)
- Wire up feature navigation (swipe on mobile, keyboard on desktop)
- Implement click-to-expand modal
- Define border radius tokens
- Deploy to Vercel

### Session 2 – 2026-06-19 · Navigation & Motion
**Goal:** Motion tokens, 3 feature placeholders, live pagination, scroll-snap navigation, entrance animations, reduced-motion support.

**Completed:**
- `tokens.ts` — `motion` section added (duration, easing, scale)
- `globals.css` — 9 motion CSS custom properties (`--motion-duration-*`, `--motion-easing-*`, `--motion-scale-*`); also `--pagination-height-mobile: 50px`
- `Playground.tsx` — full rewrite: `Feature` interface + 3 data items, scroll container, `useRef` for slides, 3 `useEffect`s (programmatic scroll, IntersectionObserver, `is-entering` class), `TOTAL_FEATURES = FEATURES.length`
- `Playground.css` — new file: `playground-scroll` with explicit `calc(100dvh - ...)` height (avoids flex-parent-chain height ambiguity), `scroll-snap-type x/y`, `playground-slide`, `@keyframes feature-enter-x/y/fade`, `prefers-reduced-motion` override
- `FeaturePreview.tsx` — `color` prop added, applied as inline style (removes hardcoded `#D9D9D9`)
- `FeaturePreview.css` — max 600×600px desktop card, `height: 100%` on `.feature` to fill slide slot
- `SidebarRight.tsx` — `onNavigate` prop, `<span>` → `<button>` for accessibility
- `SidebarRight.css` — button reset styles
- `Layout.css` — `min-height: 0` on `.layout__centre`, removed `justify-content: center` on desktop, added `overflow: hidden`
- `App.tsx` — `setCurrentFeature` destructured and wired to both `SidebarRight` and `Playground`

**Key decision — height strategy:** `min-height: 100dvh` on `.layout` means flex children can't derive definite heights from the parent chain. Scroll container uses explicit `height: calc(100dvh - var(--header-height))` on desktop and `calc(100dvh - var(--header-height) - var(--pagination-height-mobile))` on mobile instead of `flex: 1`.

**Next phase:**
- Build first real interactive component (e.g., sheet-stacking modal)
- Implement click-to-expand modal overlay
- Add keyboard navigation (arrow keys between features)
- Define border radius tokens
- Deploy to Vercel

### Session 3 – 2026-06-19 · Scroll Fix & Polish

**Goal:** Fix desktop scroll jank, paginator redesign, secondary colour token, text blur animation, 6 features.

**Completed:**

**Scroll jank fix:**
- Removed `scroll-snap-type: y mandatory` on desktop — was fighting mouse/trackpad momentum
- Added JS wheel handler (`Effect 4`) with delta accumulation (threshold 50px), 800ms cooldown, `preventDefault()` to block native scroll, `currentIndexRef` to avoid stale closure
- `container.scrollTo({ top: index * clientHeight, behavior: 'smooth' })` replaces `scrollIntoView` on desktop

**Pagination redesign (`SidebarRight.css`):**
- `::after` pseudo-element is now the visual indicator (decouples hit target from visual)
- Button is always 32×(1+16)px — `padding-block: 8px` gives 8px invisible touch target above/below
- Inactive: 16×1px at `rgba(8,7,8,0.3)`; active: 32×2px at full primary; hover: 32px at `rgba(8,7,8,0.6)`
- Gap: 16px (`space-4`); hidden on Design System page via `App.tsx` conditional

**Tokens:**
- `borderRadius: { none, sm: 2px, card: 40px }` — `--radius-sm` and `--radius-card` CSS vars
- `colors.secondary: rgba(8,7,8,0.6)` — `--color-secondary` CSS var; replaces `opacity: 0.65` on subtitle

**Text blur entrance/exit (`Playground.css`):**
- `.feature__title, .feature__subtitle` default: `filter: blur(40px)`, transition with exit easing
- `.is-entering .feature__title`: `filter: blur(0)`, `transition-delay: 150ms` (fast token)
- `.is-entering .feature__subtitle`: `filter: blur(0)`, `transition-delay: 280ms` (base token)
- Exit blur: stripping `is-entering` from departing slide triggers reverse transition automatically
- `prevIndexRef` tracks previous slide; Effect 3 removes its `is-entering` on navigation

**Design System:**
- Border Radius section now shows real swatches (none/sm/card)
- Motion section added: Duration bars, Easing dots (live CSS animation), Scale reference blocks

**6 placeholder features:** Sheet stacking, Command palette, Drag to reorder, Swipe actions, Live search, Micro-feedback

### Session 4 – 2026-06-19 · Polish, Text Animation & Feature Expand

**Goal:** Pagination gap, text rise animation, card styling update, click-to-expand modal.

**Completed:**

**Pagination (`SidebarRight.css`):**
- Gap removed (`gap: 0`) — the 8px `padding-block` on each button already creates ~16px visual breathing room between lines
- No other structural changes needed

**Text rise animation (`Playground.css`):**
- Title and subtitle start at `translateY(16px)` while the card animates in (`fill-mode: both` holds the `from` state during delay)
- Title rises to 0 after `280ms` delay (base token), subtitle after `430ms` (base + fast)
- Spring easing on the rise for subtle natural overshoot
- Stacks on top of the existing blur transition — animation controls `transform`, transition controls `filter`, no conflict
- `prevIndexRef` + stripping `is-entering` from departing slide triggers exit blur in reverse automatically

**Card styling (`FeaturePreview.css`, `Playground.tsx`):**
- All placeholder cards now white (`#FFFFFF`)
- Inside stroke: `box-shadow: inset 0 0 0 1px rgba(8,7,8,0.1)` (matches Figma inside-position 1px stroke at 10%)
- Soft elevation: `0 16px 32px -8px rgba(8,7,8,0.1)` (Y16 / blur32 / spread-8 / 10%)
- Hover: shadow deepens slightly
- `cursor: pointer`; card has `role="button"`, `tabIndex={0}`, keyboard activation (Enter/Space)

**Feature expand modal (`FeatureModal.tsx/css`, `Playground.tsx`):**
- Click card → captures `getBoundingClientRect()`, passes to `FeatureModal`
- WAAPI (`element.animate()`) drives `clip-path: inset(card-bounds round 40px) → inset(0 0 0 0 round 0px)` — 500ms enter easing
- Close animation: `inset(0) → inset(card-bounds round 40px)` — 500ms exit easing
- Exit triggers: Escape key OR "Back" button
- "Back" positioned and oriented identically to "Digital playground" sidebar label (`writing-mode: vertical-rl; transform: rotate(180deg); width: 64px`)
- `document.body.style.overflow = 'hidden'` locked while modal is open
- `z-index: 200` — sits above header and all chrome
- Modal unmounts 520ms after close triggered (matches animation duration + buffer)
- Placeholder: feature title + subtitle centred in viewport

---

### Session 5 – 2026-06-26 · Routing, Feature Page & Token Cleanup

**Goal:** Replace modal expand with page navigation, build Sheet Stacking article, fix mobile scroll jank, audit and complete design token coverage.

**Completed:**

**Mobile scroll (touch + trackpad):**
- Removed `scroll-snap-type: x mandatory` — was fighting manual snapping logic
- JS `touchmove` handler drives `container.scrollLeft` directly (1:1 finger tracking); `touchend` snaps to target slide using velocity + 30% drag-distance intent detection
- Wheel handler extended to intercept horizontal `deltaX` in mobile viewport (handles trackpad-in-mobile-viewport case)
- Mobile text entrance uses `translateX(16px → 0)` instead of desktop `translateY`

**Mobile pagination:**
- Horizontal dots: inactive 2×2px, active 32×2px pill; no hover state on mobile
- Replaced hardcoded `rgba(8,7,8,0.3)` with `var(--color-muted)` (added in token cleanup)

**Feature page routing:**
- `FeatureModal` deleted — replaced by React Router page navigation
- `react-router-dom` BrowserRouter wrapped in `main.tsx`; routes: `/` → Playground, `/feature/:id` → FeaturePage
- `src/data/features.ts` — shared Feature data (id, title, subtitle, color)
- `src/utils/navigation.ts` — `navigateWithTransition()` wrapper using View Transitions API crossfade
- `vercel.json` — SPA rewrite rule for Vercel deployment
- `FeaturePreview` card changed from `div[role=button]` to `<a href=/feature/:id>`
- `SidebarLeft` — optional `onClick` prop; on feature pages routes back to `/`

**FeaturePage (`src/pages/FeaturePage.tsx/css`):**
- Editorial article layout: 48px display title, 600px max-width, centred
- `getArticleContent(id)` switch dispatches to feature-specific article JSX
- Sheet Stacking article written: context (Woolworths), problem (modal-on-modal), solution (layered sheet stack)
- `<Button>` component used for CTA

**Semantic HTML:**
- `<section>` → `<article>` for feature cards; `<footer>` → `<div class="feature__caption">`; card `<div>` → `<a>`

**Token system cleanup:**
- `tokens.ts` — new keys: `colors.border`, `colors.muted`, `typography.display` (48px), `lineHeight` (tight/snug/base/relaxed), `letterSpacing` (tight/none/wide), `shadow` (card/cardHover)
- `globals.css` — corresponding CSS vars: `--color-border`, `--color-muted`, `--font-size-display`, `--line-height-*`, `--letter-spacing-*`, `--shadow-card`, `--shadow-card-hover`
- All hardcoded `rgba()` values replaced with tokens across `FeaturePreview.css`, `SidebarRight.css`, `FeaturePage.css`
- `DesignSystem.css` — hardcoded `letter-spacing: 0.07em` → `var(--letter-spacing-wide)`

**Button component (`src/components/Button.tsx/css`):**
- Primary variant; `12px` vertical padding scoped as `--btn-padding-y` (sits between space-3 and space-4)
- Used in FeaturePage CTA and DS explorer

**Design System page additions:**
- Typography section auto-shows `display` scale
- New sections: Line Height, Letter Spacing, Shadows, Button
- Colors section auto-shows `border` and `muted`

---

## Current status (end of Session 5)

**Folder structure (updated):**
```
src/
  components/
    Button.tsx / .css        ← NEW
    Header.tsx / .css
    SidebarLeft.tsx / .css
    SidebarRight.tsx / .css
    FeaturePreview.tsx / .css
    Layout.tsx / .css
  data/
    features.ts              ← NEW: shared feature data
  pages/
    Playground.tsx / .css
    DesignSystem.tsx / .css
    FeaturePage.tsx / .css   ← NEW: article page per feature
  utils/
    navigation.ts            ← NEW: View Transitions wrapper
  styles/
    tokens.ts
    globals.css
  App.tsx
  main.tsx
vercel.json                  ← NEW: SPA routing rewrite
```

---

### Session 6 – 2026-06-26 · Sheet Stacking Demo & Polish

**Goal:** Build the Sheet Stacking interactive demo with a real product card, sheet stacking behaviour, floating sheet presentation, and article usage instructions.

**Completed:**

**Sheet Stacking demo (`src/components/SheetStackingDemo.tsx/css`):**
- `ProductCard` component: real Unsplash skincare image, $66.99 price, name, "View details" (primary) + "Check stock" (subtle CTA)
- `Sheet` component: portal-based, focus-trapped, Escape key priority via module-level depth registry
- Two sheets: details (product specs + image) and stock checker (5 Sydney stores with in/low/out-of-stock status)
- Stack condense/expand: `is-condensed` class drives `translateX(-20px) translateY(3px) scale(0.95)` on desktop, `translateY(-24px) scale(0.95)` on mobile — all pure CSS keyframe animations, zero motion libraries

**Floating sheet presentation (`src/components/Sheet.css`):**
- Desktop: `margin: 12px` on `.sheet-wrap` — floats 12px from right, top, and bottom viewport edges
- `height: calc(100% - 24px)` — accounts for top + bottom margin
- `border-radius: 16px` on `.sheet-panel` with `overflow: hidden` to clip content to rounded edges
- Scoped as `--sheet-radius: 16px` component token

**Product image:**
- `PRODUCT_IMAGE_URL` constant exported from `ProductCard.tsx` — Unsplash photo `1580870069867-74c57ee1bb07` (The Ordinary skincare bottles on white)
- Used in both the product card and the details sheet header
- `<img>` with `object-fit: cover` — replaces previous SVG bottle illustration

**Article usage hint (`src/pages/FeaturePage.tsx/css`):**
- `<p className="feature-page__hint">` at end of SheetStackingArticle — explains View details → Check stock near you flow and standalone Check stock path
- Styled: `font-size: xs`, bordered box (`rgba(8,7,8,0.03)` background + `--color-border` border), semibold `<strong>` for action names

**Current status:**
- Sheet Stacking feature page is complete with article, usage hint, and fully interactive demo
- Floating sheet verified: bounding box `y: 12`, width 400px, height `calc(100dvh - 24px)`

**Next phase:**
- Mobile sheet content height (make both sheets tall enough to reduce awkward stacking gap)
- Keyboard navigation between features (arrow keys on Playground)
- Build second interactive feature (Command palette or Drag to reorder)
- Deploy to Vercel

---

### Session 7 – 2026-06-28 · Token Architecture & Semantic Rename

**Goal:** Implement layered primitive → semantic → CSS var → CSS class token architecture; semantic border-radius and shadow rename; reduce button shadow strength.

**Completed:**

**Layered token architecture (`tokens.ts`, `globals.css`, `surfaces.css`):**
- `tokens.ts` now has a `primitive` section: raw color alpha scales (white 8/12/18/60/85%, black 40%, grey 30/50/950) and 9 shadow layers (ambient/contact/pressed variants)
- `globals.css` exposes primitives as `--primitive-*` vars, then composes them into semantic vars: `--surface-raised1-*` / `--surface-raised2-*` / `--btn-primary-*`
- `surfaces.css` — new file: `.raised-surface` and `.raised-surface--2` classes. All values via semantic vars, zero raw values in class CSS
- Component CSS uses only semantic vars (`--btn-primary-*`, `--surface-raised1-*`) — the primitive layer is internal only

**`Button.tsx/css` rewrite:**
- Props changed from `children: React.ReactNode` to `label: string` (simpler, avoids accidental nesting)
- Class renamed `btn` → `btn-primary`; all styles via `--btn-primary-*` semantic vars
- Box-shadow is 4-layer: outline, inset-top highlight, inset-bottom depth, ambient+contact drop-shadow
- Hover: `translateY(-1px)` + deeper shadow; Active: `translateY(1px) scale(0.97)` + pressed inset shadow

**`FeaturePreview` → `.raised-surface`:**
- Removed `color` prop and `Feature.color` from data — cards no longer need per-card background
- Card now uses `.raised-surface` class: #FAFAFA background, white border, 4-layer shadow

**Semantic border-radius rename:**
- Old scale names (`none/sm/lg/xl/card/pill`) replaced with use-case names: `indicator/inset/panel/cardInset/card/button`
- All CSS files updated — zero hardcoded radius values remain in component CSS
- `--sheet-radius` scoped component token now points to `var(--radius-panel)` instead of `16px`

**Shadow rename + strength reduction:**
- `shadow.card/cardHover` → `shadow.surface/button`
- Button primitive shadows reduced ~50–60%: ambient dark 0.28→0.12, contact dark 0.20→0.08, pressed 0.20→0.10, pressedInset 0.35→0.20
- `ProductCard` updated: `border-radius: 16px` → `var(--radius-card-inset)`, `var(--shadow-card)` → `var(--shadow-surface)`

**Design System page additions:**
- Border Radius section now shows 6 semantic swatches
- Shadows section shows `surface` and `button` (renamed from card/cardHover)
- New "Raised Surface" section with Level 1 and Level 2 swatches

---

### Session 8 – 2026-06-29 · About Page & Housekeeping

**Goal:** Build the About page with a cylindrical drum animation, floating hover thumbnails, and wire up routing. Clean up stale token and fix button cascade.

**Completed:**

**Token cleanup:**
- Removed `grey-950` from `tokens.primitive.color.grey` — was only used for `--btn-primary-bg`
- `--btn-primary-bg` in `globals.css` now uses `var(--color-primary)` directly

**SidebarLeft sticky fix (`SidebarLeft.css`):**
- Desktop: `position: sticky; top: var(--header-height); height: calc(100dvh - var(--header-height)); align-self: flex-start`
- Keeps the vertical label centred in view on long-scroll pages (e.g. Design System)

**Button secondary sm height fix (`Button.css`):**
- `.btn--sm` was declared before `.btn-secondary`, so `.btn-secondary { height: var(--btn-primary-height) }` won the cascade
- Fixed by moving `.btn--sm` to the end of the file so it overrides both variant height declarations

**About page (`src/pages/About.tsx/css`):**
- Route: `/about` → `<About />`; `App.tsx` sets SidebarLeft title to `'About'` on this route
- Layout: two-column on desktop (`45% heading / 55% drum`, `height: calc(100dvh - var(--header-height))`), single-column mobile
- 23-item `ITEMS` array: personal facts, activities, design/code phrases; 3 items have `imageSrc` for hover thumbnails
- **Drum animation (rAF):** `VISIBLE_COUNT = 13`, `LINE_SLOT = 58px`, `TOTAL_DURATION = 30s` (~49px/sec). Per-item: cosine horizontal arc (`MAX_CURVE_OFFSET = 56px`), `perspective(700px) rotateX` tilt (`MAX_ROTATE_X = 55°`), opacity fade — all derived from `distance / centreSlot` normalised value. `prefers-reduced-motion`: rAF cancelled, list static.
- **Drum mask:** inline `maskImage: linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)` on wrapper div; `overflow: visible` lets the cosine arc extend left of the container
- **Hover thumbnails:** `<img ref={imgRef}>` always in DOM, `visibility: hidden/visible` toggled; position updated via `imgRef.current.style` directly on `mousemove` (zero re-renders); `display: none` on mobile
- **Hover colour:** `.about__item` transitions `color: var(--color-secondary) → var(--color-primary)` in 80ms linear

**Key decisions:**
- rAF instead of CSS animation: cosine arc + per-item rotateX + opacity require JS math per frame — not expressible in CSS keyframes
- Floating image via DOM ref (not state) to avoid 60fps re-renders on mousemove
- `overflow: visible` on drum wrapper + inline maskImage for top/bottom fade only (left/right must not clip the arc)

---

### Session 9 – 2026-07-20 · Header Fade, Category Dock & Reveal Stack

**Goal:** Header gradient fade, About list typography, two new interactive features (Category Dock, Reveal Stack), and two new tokens.

**Completed:**

**Header top fade (`Layout.tsx/css`, `Header.css`):**
- Content should fade out behind the sticky header on all pages. First attempts (gradient background on `.header`, then a `::after` pseudo-element) hard-cropped because the Playground scroll container clips content at its own top edge — the fade couldn't cross that boundary
- Fix: a `position: fixed` overlay `.layout__top-fade` in `Layout.tsx`, sitting at `top: var(--header-height)`, `height: 48px`, `z-index: 99`, `linear-gradient(to bottom, var(--color-neutral) 0%, transparent 100%)`. Lives in the root stacking context so it always paints above scroll content. `pointer-events: none`
- Header itself reverted to solid `var(--color-neutral)`; the `fade` prop experiment was removed

**About list typography (`About.css`):**
- `.about__item` changed to `--font-size-lg` (was base), `--letter-spacing-none` (was wide) — semibold, uppercase retained

**New tokens:**
- Typography `xxs` — 11px / `0.6875rem` (tooltips, micro-labels). Added to `tokens.ts`, `--font-size-xxs` in `globals.css`; auto-shows in DS Typography
- Border radius `tile` — 16px (square media tiles — dock items, thumbnail chips). Added to `tokens.ts`, `--radius-tile` in `globals.css`; auto-shows in DS Border Radius

**Category Dock feature (`CategoryDock.tsx/css`):**
- macOS-dock cursor-driven magnification. Logic ported from a reference impl: refs + direct `style.transform` mutation on mousemove, zero setState (same pattern as About drum/thumbnail). Only `transform` (translateX + scale) animates
- Raised-cosine `falloff()`, `MAX_SCALE = 1.3`, `INFLUENCE_RANGE = 150`, `REST_SIZE = 72`, `GAP = 4`. Guaranteed 4px gap at any magnification via cumulative-width translateX deltas (transform-origin centre → scaling never moves a tile's centre)
- `transform-origin: center bottom` = shared baseline. Single tooltip (highest-scale tile wins). Tile geometry passed inline from TSX consts so CSS stays purely visual
- Tile treatment: `--surface-raised1-*` composed directly with `--radius-tile` override. Tooltip: `--color-secondary` bg, `--font-size-xxs`, 8px (`--space-3`) above tile, `--radius-button` pill
- `prefers-reduced-motion`: mousemove no-op + CSS transition override

**Reveal Stack feature (`RevealStack.tsx/css`):**
- Tap-to-fan pile of "news story" cards. State-driven (`expanded` toggle) — animates on click not per-frame, so React state + CSS transitions on `transform` (unlike the dock's refs)
- Collapsed: cards nest behind a 100px header, each `0.95^(i+1)` scale, peeking 8px below the one above (tapered stack). Expanded: all scale 1.0, 8px gaps, per-card 40ms stagger (reversed on collapse). `transform-origin: top center`
- `HEADER_H = CARD_H = 100`, `GAP = PEEK = 8`. Container height animates between `HEADER_H + PEEK*N` (124) and `HEADER_H + N*(CARD_H+GAP)` (424) — less vertical scroll when collapsed
- Card layout: 64px (`--space-8`) grey placeholder thumbnail left, category overline (`--font-size-xxs`) + truncating headline right. Header = raised-surface L1 (neutral placeholder — brand yellow deferred to a scoped token later), cards = raised-surface L2. Chevron rotates 180° on open
- `prefers-reduced-motion`: transitions off, toggle still works

**Feature wiring (`features.ts`, `FeaturePage.tsx`):**
- Both added to `FEATURES` (after sheet-stacking): `category-dock`, `reveal-stack`. Playground picks them up via `TOTAL_FEATURES`
- `FeaturePage` article + demo switches extended; both have placeholder articles marked `{/* PLACEHOLDER */}`. Demos wrapped in centred `.category-dock-demo` / `.reveal-stack-demo` frames
- Category Dock was briefly shown on the DS page, then moved to its own feature page per direction

**Key decisions:**
- Dock uses refs (per-frame mouse tracking); Reveal Stack uses state (discrete click) — right tool per interaction cadence
- Top fade must be a fixed overlay, not header background — scroll-container clipping defeats any in-header approach

---

### Session 10 – 2026-07-24 · Feature Page Redesign, Dock Variants & Sheet Stack Cover

**Goal:** Real imagery for Category Dock, a full Reveal Stack rework into a music queue, a redesigned feature-page template with a bleeding preview well, a one-off animated project cover, a second Category Dock variant, and variant pagination.

**Completed:**

**Category Dock polish (`CategoryDock.tsx/css`):**
- Tooltip reveal upgraded from a plain fade to a pop: `scale(0.95→1)` + `translateY` (3px), transition on `--motion-duration-fast` — reads as a small spring rather than a fade
- Real fruit images replace the grey circle placeholders (Apples, Bananas, Citrus, Berries, Melons, Mangoes, Avocados), `mix-blend-mode: multiply` on each `<img>` blends the product shots' white backgrounds into the tile surface with no visible seam

**Motion Scale removed (`DesignSystem.tsx/css`, `tokens.ts`, `globals.css`):**
- The DS "Scale" subsection under Motion was dropped — scale amounts turned out to be entirely component-specific (dock's 1.3, drum's cosine arc, reveal stack's 0.95 cascade), so a single universal token never described reality
- Once the display section was gone, `tokens.motion.scale` and `--motion-scale-from/to` had zero remaining consumers anywhere in the codebase — removed outright rather than left orphaned

**SidebarLeft — "Back" on feature pages (`App.tsx`):**
- Title logic now reads `isFeaturePage ? 'Back' : ...` instead of always showing "Digital playground"; About and Playground unaffected

**Reveal Stack rework — from placeholder "news stories" to a real "Up next" queue (`RevealStack.tsx/css`):**
- Content changed to a 3-track queue: Jammin/RUBII, Dedpresidents/Knxwledge, Bad Company/Yazmin Lacey
- Architecture changed to an anchor + fan model: track 0 is always shown at full scale (never part of the collapse cascade) with tracks 1–2 nesting/fanning behind it using the same cascade math the old 3-card version used, just index-shifted by one
- Card height now content-driven: `CARD_H = 56` (32px image + 12px padding × 2, no longer the old fixed 100px)
- Header changed from a raised-surface button to a plain text + icon-button row; chevron shows a hover-only circle (`--btn-secondary-bg`, black-10) instead of a static background
- **New tokens:** `--radius-row` (12px, global semantic — "compact list rows") for the track row corners; `--track-pad` (12px) scoped as a **local** component token on `.reveal-stack__card` rather than a global spacing entry, since the spacing scale is a fixed indexed array (`space-0`…`space-8`) and inserting 12 there would've renumbered every `--space-4`+ reference site-wide

**Sheet Stack Cover — new one-off decorative motif (`SheetStackCover.tsx/css`):**
- Animated cover for the Sheet Stacking project card, ported 1:1 from an approved static HTML reference (colours, keyframes, timing percentages unchanged)
- First use of CSS container queries in this codebase: wrapper has `container-type: inline-size` + `aspect-ratio: 1/1`, every fixed px length converted to `cqw` against the source's 600px frame, so the whole motif (including its 40px panel radius) scales proportionally with the card
- All colours/radii/timing are **local** CSS custom properties on `.ssc-panel` — deliberately kept out of `tokens.ts`; this is one-off artwork, not a design-system pattern
- `FeaturePreview` gained an optional `cover` prop — when present it replaces the `.raised-surface` chrome entirely (the cover **is** the surface, complete with its own elevation), rather than sitting inside a card

**Feature page template redesign (`FeaturePage.tsx/css`):**
- Component preview moved above the article body copy (previously below, after a `border-top` divider)
- Preview well bleeds past the article's own horizontal padding: `.feature-page__article` scopes `--article-pad-x`, the well cancels exactly that via `margin-inline: calc(-1 * var(--article-pad-x))` — 600px well vs. 552px body text on desktop, auto-adjusts to mobile's 16px padding through the same variable
- **New tokens:** primitive `grey-70` (`#F5F6F7`) → semantic `--surface-preview-bg` + `--surface-preview-radius` (`--radius-card`) — a flat well, deliberately with no border/inset/shadow, unlike the raised-surface tiers it sits next to
- Tagline ("Interaction pattern") rotated `-7deg`; `width: fit-content` is load-bearing here — rotating a full-width block would swing the far edge tens of px out of place, hugging the text keeps the arc small
- All three articles' "Try it below" hints corrected to "Try it above" now that the demo sits above the copy

**Category Dock — second "bar" variant (`CategoryDock.tsx/css`):**
- Component generalized with `variant?: 'tile' | 'bar'` and `items?: DockItem[]` props; existing fruit/tile usage untouched as the default
- New "bar" variant: bare character images (Jesse, Elsa, Bullseye, Moana, Spiderman, Chicken, Thing — Funko-style figurines) with no per-item tile chrome, floating over one shared `.raised-surface` bar
- Bar is exactly as tall as a resting item (62px); since items still grow from `transform-origin: center bottom`, magnified ones peek above the bar automatically — just `z-index: 0` on the bar under the items' JS-driven z-index, no extra positioning logic needed
- Bar padded 24px wider than the item row on each side via the existing `--space-6` token (no new token needed)
- `src/assets/images/` reorganized into `fruit/` and `characters/` subfolders, one per dock variant

**Variant pagination (`PreviewPagination.tsx/css`, `navigation.ts`, `FeaturePage.tsx`):**
- New reusable dot/pill indicator, visually mirroring `SidebarRight`'s mobile pagination (2×2 inactive dot → 32×2 active pill)
- `withViewTransition()` extracted out of `navigateWithTransition()` as a shared helper — same root crossfade now also drives in-place variant swaps, not just route changes
- `FeaturePage` demo model changed from a single node to `getDemoVariants(id): ReactNode[]`; dots render only when a feature has 2+ variants (Category Dock is currently the only one, showing its tile and bar variants). Switching route resets to variant 0 via a `useEffect` keyed on `id` (React Router doesn't remount on param-only changes)

**Key decisions:**
- Radius vs. spacing tokens treated differently for one-off values: `radius` has a semantic naming system that scales (`row` added globally, matching the `tile` precedent), `spacing` doesn't (fixed index array) — so one-off spacing values become local scoped tokens instead
- View Transitions reused as-is for variant swaps rather than adding scoped `view-transition-name`s — since only the differing pixels (the well's content) actually change between snapshots, the crossfade reads as scoped even though it's technically a full-page transition
- Cover component's tokens deliberately excluded from `tokens.ts` — one-off project art doesn't belong in the shared token surface

---

### Session 11 – 2026-07-26 · Button Family, Sheet Variants, Cart Easter Egg & Reveal Stack Cover

**Goal:** Adopt `lucide-react`; grow Button into a full variant family with an icon-only mode; give Sheet a chrome-free floating variant; rebuild the Sheet Stacking demo into an ecommerce cart easter egg; ship a second animated project cover for Reveal Stack; get the project onto GitHub.

**Completed:**

**Icon library adopted:**
- `lucide-react` installed (zero runtime deps). Convention going forward: every icon renders at `strokeWidth={1.5}`

**Button family — icon-only mode + 3 new variants (`Button.tsx/css`, `globals.css`):**
- `icon` prop added as a discriminated-union alternative to `label`: icon-only requires `aria-label`, the two modes are mutually exclusive via `icon?: never` / `label?: never` typing. Branch check must be `props.icon` (truthy) — `'icon' in props` does **not** narrow reliably against a sibling branch that declares the same key as `?: never`
- Icon-only sizing reuses the *existing* height tokens as width (40px default / 32px sm via `--btn-primary-height` / `-sm-height`) rather than adding new size tokens — square-via-equal-dimensions, still fully round via the existing `--radius-button`
- Icon glyph size is centralised in Button (24px default / 20px sm) — consumers just pass the icon component reference, never size or stroke it themselves
- Three new variants: `tertiary` (transparent at rest, `--btn-secondary-bg` black-10 on hover only — reuses the token, no duplicate), `scrim` (translucent `--scrim-light-bg` white-85 chip + `--shadow-button`, for icon buttons that float over imagery), `destructive` (secondary's grey surface + `--color-danger` text)
- New tokens: `--color-danger` (`#D92D20`), `--btn-tertiary-color`, `--scrim-light-bg` (primitive white-85), `--btn-scrim-color`, `--btn-scrim-hover-bg`, `--btn-destructive-color`

**Real bug found + fixed while touching Button:**
- `tsc --noEmit` with no `-p` flag was a silent no-op all session — the root `tsconfig.json` has `files: []` and only `references`, so it type-checked nothing. Correct command: `tsc --noEmit -p tsconfig.app.json`
- Running the real check surfaced a genuine pre-existing bug: `ProductCard.tsx` passed `<Button>View details</Button>` as children, which `Button` never accepted or rendered — that button had been silently blank since it was written. Fixed to `label="View details"`. (`ProductCard` turned out to be otherwise-dead code — `SheetStackingDemo` only ever imported its image constant — left in place pending direction, not deleted)

**Sheet — `variant` prop (`Sheet.tsx/css`):**
- `variant?: 'header' | 'floating'`, defaults to `'header'` (= prior behaviour, fully backward compatible)
- `'floating'`: no title bar, no border — close button floats top-right over the content (e.g. over a hero image) using the new `scrim` Button variant. `title` still supplies the dialog's accessible name, via `aria-label` instead of `aria-labelledby` since there's no visible heading to point to
- Both sheet close buttons (header and floating) migrated onto the shared `Button` — icon-only, Lucide `X`, 1.5 stroke. Bespoke `.sheet-close` / `.sheet-close--floating` CSS deleted entirely; all that remains is `.sheet-close-float`, a 4-line positioning-only rule

**QuantityStepper (`QuantityStepper.tsx/css` — new):**
- `[−] n [+]` pill — the container adopts the secondary button's surface/height; the two controls are `tertiary` icon Buttons nested inside, so sizing, icons and stroke all inherit from Button rather than being reimplemented
- Decrementing past 1 emits `0` — callers treat that as "remove this line"

**Sheet Stacking demo — rebuilt as a cart easter egg (`SheetStackingDemo.tsx/css`, `data/cartProducts.ts` — new):**
- Sheet 1 = cart (5 joke line items — "Assorted Stakeholder Feedback Vague Comments", "Component detacher", etc. — each with bespoke blurb/features/instructions copy), Sheet 2 = product details, stacked on top exactly like the old details/stock pair — now demonstrating a deliberate ecommerce pattern: product info opens as a layer over the cart instead of navigating away from it
- Single `quantities` state (id → qty) drives both sheets, so the stepper in the cart list and the one in the details sheet always agree. Cart tile price = unit × qty, live; decrementing a line to 0 removes it entirely
- Details footer swaps on cart membership: in-cart → `Remove` (`destructive` variant) + full-size `QuantityStepper`; removed → single primary `Add to cart`
- Article copy rewritten around the cart-abandonment rationale for the pattern

**Design System page:**
- Added swatches for `tertiary`, `scrim` (shown on a dark demo backdrop, since it's designed for imagery rather than the DS page background), `destructive`, and icon-only mode across primary/secondary/tertiary

**RevealStackCover — second animated project cover (`RevealStackCover.tsx/css` — new):**
- Same architecture as `SheetStackCover`: `container-type: inline-size` + `aspect-ratio 1/1`, all lengths in `cqw` against a 600px reference frame, every colour/radius/timing kept **local** (not in `tokens.ts`)
- 3 list rows fan open / nest closed on a loop. Row 1 is a fixed anchor; rows 2–3 share one `rsc-fan` keyframe block driven by per-row custom properties (`--collapsed-y/-s`, `--expanded-y`) instead of two near-duplicate blocks — makes "these rows move identically" structural rather than a tuning coincidence
- Collapsed: 560×173.33px rows, 0.9 / 0.81 scale cascade, 28px peeks. Expanded: all rows 560px, 20px gaps, 20px padding all sides — geometry closes exactly at the 600px reference frame
- Palette (violet/magenta mesh + inline `feTurbulence` grain) approximated from reference screenshots, adjustable via the local CSS vars on `.rsc-panel`
- Wired into `Playground.tsx` via `FeaturePreview`'s existing `cover` prop

**Motion tuning on RevealStackCover (three iterations, landed on the third):**
1. Stagger between rows 2/3 → user asked for them to settle together — fixed at the structural level (one shared keyframe block) rather than just re-timing two separate ones
2. `--motion-duration-base` (280ms) + standard easing on a 6.4s loop → read as too static (91% of the loop was a held frame), reverted
3. **Landed:** `--motion-duration-slow` (500ms) each way on `--motion-easing-standard`, 6s total loop, 2.5s held per state. Verified via the Web Animations API (`animation.currentTime`) — reassigning `animation-delay` on an already-running animation does **not** reseek it, a measurement mistake made and caught mid-session. A fourth attempt at `enter`/`exit` easing for a spring feel was also tried and rejected: `animation-timing-function` inside `@keyframes` silently ignores `var()` and falls back to `linear`, and even with literal cubic-beziers neither curve produced overshoot (neither has a control point past 1) — true bounce needs `--motion-easing-spring`

**Project shipped to GitHub:**
- Initialised as a git repo; `.gitignore` extended to exclude `memory/` and `.claude/settings.local.json` (assistant-local state, not project source) — `.claude/launch.json` kept, it's useful dev-server config for other clones
- Pushed to `https://github.com/Tomwinter89/Showcase` on `main`

**Key decisions:**
- `props.icon` truthy check for Button's discriminated union, not `'icon' in props`
- Icon-only buttons reuse existing height tokens as width rather than adding a parallel size scale
- `tsc --noEmit -p tsconfig.app.json` is the real typecheck command for this project — bare `tsc --noEmit` silently checks nothing
- Per-row CSS custom properties feeding one shared `@keyframes` block, not near-duplicate blocks, whenever multiple elements must move in guaranteed lockstep
- `animation-timing-function` inside `@keyframes` needs literal cubic-bezier values — `var()` fails silently to `linear`

---

## Current status (end of Session 11)

**Completed features:**
- Sheet Stacking — cart easter egg (2 stacked sheets: cart + product details), full article, animated project cover
- Category Dock — two variants (fruit tiles, character bar) with pagination between them, full article
- Reveal Stack — "Up next" track queue demo, full article, animated project cover

**Placeholder features (article + demo needed):**
- Command palette
- Drag to reorder
- Swipe actions
- Live search
- Micro-feedback

**Pages:**
- `/` — Playground (8 feature cards, scroll/swipe navigation; Sheet Stacking and Reveal Stack both show animated covers)
- `/feature/:id` — FeaturePage (bleeding preview well + pagination for multi-variant demos, article below)
- `/about` — About page (drum animation, hover thumbnails)
- `/design-system` — DS explorer easter egg (Cmd+Shift+D)

**Folder structure (updated):**
```
src/
  assets/
    images/
      fruit/                   ← Category Dock tile variant
      characters/              ← Category Dock bar variant
  components/
    Button.tsx / .css           ← primary/secondary/tertiary/scrim/destructive + icon-only mode
    CategoryDock.tsx / .css     ← tile + bar variants, DockItem[] props
    Header.tsx / .css
    Layout.tsx / .css
    PreviewPagination.tsx / .css
    ProductCard.tsx / .css      ← unused/dead code — SheetStackingDemo only imports its image constant
    QuantityStepper.tsx / .css  ← NEW: [-] n [+] pill, built on icon Buttons
    RevealStack.tsx / .css      ← "Up next" track queue
    RevealStackCover.tsx / .css ← NEW: animated project cover
    Sheet.tsx / .css            ← `variant`: 'header' | 'floating'
    SheetStackCover.tsx / .css  ← animated project cover
    SheetStackingDemo.tsx / .css ← cart easter egg
    SidebarLeft.tsx / .css
    SidebarRight.tsx / .css
    FeaturePreview.tsx / .css
  data/
    cartProducts.ts             ← NEW: 5 joke cart products
    features.ts
  pages/
    About.tsx / .css
    DesignSystem.tsx / .css
    FeaturePage.tsx / .css
    Playground.tsx / .css
  utils/
    navigation.ts
  styles/
    tokens.ts
    globals.css
    surfaces.css
  App.tsx
  main.tsx
vercel.json
```

**Next priorities:**
- Rewrite the placeholder articles for Category Dock and Reveal Stack (marked `{/* PLACEHOLDER */}`)
- Decide the fate of `ProductCard.tsx` (dead code)
- Keyboard navigation between features (arrow keys on Playground)
- Deploy to Vercel (repo is now on GitHub, ready for it)

---

## Future considerations / Nice to have

- **Design System page — Visual / Code toggle:** Segmented control at the top of the DS page that switches between the current visual swatch view and a code view showing CSS variable names + resolved values (for token sections) or JSX usage examples (for component sections). Recommended approach: token sections show `--var-name → resolved value`; component sections show a short usage snippet. The segmented control itself would be a dogfooding opportunity.

- **Primitive colours in DS page:** The `tokens.primitive.color` values (white/black/grey alpha scales) are currently invisible in the DS page — only `tokens.colors` is shown. Could add a collapsible "Primitive" subsection under Colours for completeness.
