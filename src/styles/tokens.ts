// Single source of truth for all design tokens.
// Components and the DesignSystem page both import from here.
// Never hardcode colours, sizes, or spacing outside this file.

export const tokens = {
  colors: {
    primary:   '#080708',              // near-black
    secondary: 'rgba(8, 7, 8, 0.6)',  // primary at 60% alpha — body copy, labels
    neutral:   '#E6E8E6',             // light grey, page background
    accent:    '#0000FF',             // internet blue
    white:     '#FFFFFF',
    border:    'rgba(8, 7, 8, 0.1)',  // card strokes, subtle borders
    muted:     'rgba(8, 7, 8, 0.3)',  // inactive indicators, disabled states
    danger:    '#D92D20',             // destructive actions — remove, delete
  },

  // Standard t-shirt scale throughout — xxs through xl are plain system-sans
  // sizes; xxl and display additionally carry New Title as their primary
  // fontFamily (with a system-sans alternative documented via the
  // "system"/"systemSemibold" weight keys, since both sizes see real usage
  // in the plain UI font too — see Bookshelf/NavMenu).
  typography: {
    xxs:     { size: '0.6875rem', weights: { regular: 400, semibold: 600 } },  // 11px — tooltips, micro-labels
    xs:      { size: '0.8125rem', weights: { regular: 400, semibold: 600 } },  // 13px
    sm:      { size: '0.9375rem', weights: { regular: 400, semibold: 600 } },  // 15px
    base:    { size: '1.0625rem', weights: { regular: 400, semibold: 600 } },  // 17px
    lg:      { size: '1.3125rem', weights: { regular: 400, semibold: 600 } },  // 21px
    xl:      { size: '2rem',      weights: { regular: 400, semibold: 600 } },  // 32px — mobile nav menu items, medium headings
    xxl: {
      size: '4rem',                                                             // 64px
      weights: { regular: 400, medium: 500, system: 400, systemSemibold: 600 },
      fontFamily: "'New Title', system-ui, sans-serif",
    },  // large numerals (Bookshelf), or system sans at 400/600 (NavMenu desktop) — New Title (ITF) is the primary face
    display: {
      size: '8rem',                                                             // 128px
      weights: { regular: 400, medium: 500 },
      fontFamily: "'New Title', system-ui, sans-serif",
    },  // hero / feature page titles — New Title (ITF)
  },

  // Spacing scale indexed 0–8
  spacing: [0, 2, 4, 8, 16, 20, 24, 32, 64] as const,

  fontFamily: "system-ui, -apple-system, sans-serif",

  borderRadius: {
    indicator: '2px',    // pagination lines, progress tracks, UI bars
    inset:     '4px',    // inline content boxes — hint panels, callouts, labels
    row:       '12px',   // compact list rows — track rows, playlist items
    tile:      '16px',   // square media tiles — dock items, thumbnail chips
    panel:     '20px',   // sheets, drawers — floating panels
    cardInset: '24px',   // secondary / nested cards — raised surface level 2
    card:      '32px',   // primary surfaces — feature cards, raised surface level 1
    button:    '999px',  // fully-rounded pill buttons
  },

  lineHeight: {
    tight:   '1.05',  // display / hero titles
    snug:    '1.2',   // subheadings
    base:    '1.4',   // UI labels and captions
    relaxed: '1.65',  // long-form body copy
  },

  letterSpacing: {
    tight:  '-0.02em',  // large display titles
    none:   '0em',
    wide:   '0.08em',   // small caps, uppercase labels
  },

  shadow: {
    surface: '0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.06)',  // raised surface drop-shadow
    button:  '0 2px 8px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)',  // button elevation
  },

  // Raw primitive values — referenced by semantic tokens in globals.css.
  // Do not use primitive tokens directly in component CSS.
  primitive: {
    color: {
      white: {
        8:  'rgba(255, 255, 255, 0.08)',   // button outline
        30: 'rgba(255, 255, 255, 0.30)',   // button inset top (default)
        40: 'rgba(255, 255, 255, 0.40)',   // button inset top (hover)
        60: 'rgba(255, 255, 255, 0.60)',   // surface inset left highlight
        85: 'rgba(255, 255, 255, 0.85)',   // surface border rim
      },
      black: {
        10: 'rgba(8, 7, 8, 0.10)',         // --color-border; secondary button bg
        20: 'rgba(8, 7, 8, 0.20)',         // secondary button hover bg
        30: 'rgba(8, 7, 8, 0.30)',         // --color-muted
        40: 'rgba(8, 7, 8, 0.40)',         // button inset bottom depth edge
        60: 'rgba(8, 7, 8, 0.60)',         // --color-secondary
      },
      grey: {
        30:  '#FDFDFD',   // surface level 2 background
        50:  '#FAFAFA',   // surface level 1 background
        70:  '#F5F6F7',   // preview well background — flat, slightly cool cast
      },
    },
    shadow: {
      ambientSm:     '0 2px 12px rgba(0, 0, 0, 0.06)',
      ambientMd:     '0 4px 24px rgba(0, 0, 0, 0.08)',
      ambientDarkMd: '0 2px 8px rgba(0, 0, 0, 0.12)',   // button default — reduced from 0.28
      ambientDarkLg: '0 4px 12px rgba(0, 0, 0, 0.16)',  // button hover — reduced from 0.32
      contactSm:     '0 1px 3px rgba(0, 0, 0, 0.04)',
      contactMd:     '0 1px 4px rgba(0, 0, 0, 0.06)',
      contactDarkMd: '0 1px 2px rgba(0, 0, 0, 0.08)',   // button contact — reduced from 0.20
      pressed:       '0 1px 4px rgba(0, 0, 0, 0.10)',   // reduced from 0.20
      pressedInset:  'inset 0 1px 3px rgba(0, 0, 0, 0.20)',  // reduced from 0.35
    },
  },

  // Motion — durations and easing curves for entrance animations
  motion: {
    duration: {
      fast: '150ms',
      base: '280ms',
      slow: '500ms',
    },
    easing: {
      standard: 'cubic-bezier(0.4, 0, 0.2, 1)',  // general UI movement
      enter:    'cubic-bezier(0.0, 0, 0.2, 1)',   // elements coming into view
      exit:     'cubic-bezier(0.4, 0, 1, 1)',     // elements leaving view
      spring:   'cubic-bezier(0.34, 1.56, 0.64, 1)', // slight overshoot/bounce
    },
  },
} as const;

// Convenience type exports
export type ColorToken      = keyof typeof tokens.colors;
export type TypographyScale = keyof typeof tokens.typography;
export type SpacingIndex    = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type MotionDuration  = keyof typeof tokens.motion.duration;
export type MotionEasing    = keyof typeof tokens.motion.easing;
