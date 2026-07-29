import './RevealStackCover.css';

/**
 * REVEAL STACK COVER — decorative animated motif for the Reveal Stack
 * project cover. A one-off piece of artwork, NOT a design-system pattern:
 * every colour, radius and timing value lives as a local CSS custom
 * property in RevealStackCover.css, deliberately kept out of tokens.ts.
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
 * aria-hidden — purely decorative, carries no information.
 */
export function RevealStackCover() {
  return (
    <div className="reveal-stack-cover" aria-hidden="true">
      <div className="rsc-panel">
        <div className="rsc-row rsc-row--1" />
        <div className="rsc-row rsc-row--2" />
        <div className="rsc-row rsc-row--3" />
      </div>
    </div>
  );
}
