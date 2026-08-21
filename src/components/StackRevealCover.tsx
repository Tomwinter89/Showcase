import './StackRevealCover.css';

/**
 * STACK REVEAL COVER — decorative animated motif for the Stack Reveal
 * project cover. A one-off piece of artwork, NOT a design-system pattern:
 * every colour, radius and timing value lives as a local CSS custom
 * property in StackRevealCover.css, deliberately kept out of tokens.ts.
 *
 * Three list rows fan open and nest back down on a 6s loop. Each move runs
 * 500ms (--motion-duration-slow) on --motion-easing-standard, with 2.5s held
 * in each state. Row 1 never moves; rows 2 and 3 share one keyframe block so
 * they always travel and settle in sync.
 *
 * Geometry is expressed in `cqw` against a 600px reference frame, so the
 * whole motif scales with the card:
 *   20px padding / 20px gap → 3.333cqw   560px row width  → 93.333cqw
 *   173.333px row height    → 28.889cqw
 *
 * Internal classes use the `strc-` prefix (STack Reveal Cover) rather than
 * the literal initials `src-` — that collides with the standard `src`
 * attribute/folder name too easily to be worth the strict consistency with
 * SheetStackCover's `ssc-`/the old `rsc-` prefix this replaces.
 *
 * aria-hidden — purely decorative, carries no information.
 */
export function StackRevealCover() {
  return (
    <div className="stack-reveal-cover" aria-hidden="true">
      <div className="strc-panel">
        <div className="strc-row strc-row--1" />
        <div className="strc-row strc-row--2" />
        <div className="strc-row strc-row--3" />
      </div>
    </div>
  );
}
