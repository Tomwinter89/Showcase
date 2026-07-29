import './SheetStackCover.css';

/**
 * SHEET STACK COVER — decorative animated motif for the Sheet Stacking
 * project cover. A one-off piece of artwork, NOT a design-system pattern:
 * every colour, radius, and timing value lives as a local CSS custom
 * property in SheetStackCover.css, deliberately kept out of tokens.ts.
 *
 * Ported 1:1 from the approved source (sheet-stack-thumb.html) — markup,
 * colours, keyframes, and timing percentages unchanged. Fixed px lengths
 * are converted to `cqw` against a 600px reference frame so the whole motif
 * scales with the card's width (its container-type: inline-size wrapper).
 *
 * aria-hidden — purely decorative, carries no information.
 */
export function SheetStackCover() {
  return (
    <div className="sheet-stack-cover" aria-hidden="true">
      <div className="ssc-panel">
        <div className="ssc-bg-scrim" />
        <div className="ssc-sheet ssc-sheet--back" />
        <div className="ssc-scrim-2" />
        <div className="ssc-sheet ssc-sheet--front" />
      </div>
    </div>
  );
}
