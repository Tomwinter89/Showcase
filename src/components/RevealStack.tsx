import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './RevealStack.css';

/**
 * REVEAL STACK — an "up next" queue that fans open on tap.
 *
 * The first track is always shown in full beneath the header — it's real
 * content, not a placeholder banner. Collapsed, the remaining tracks nest
 * behind it: each one 0.95× the scale of the one above and peeking 8px
 * below it — a tapered stack. Tapping the chevron fans them out below the
 * first track: every card returns to scale 1, spaced 8px apart, with a
 * short per-card stagger so the reveal reads as a deliberate unfurl.
 *
 * State-driven (a single `expanded` toggle) rather than a per-frame ref
 * mutation — this animates on click, not on mouse movement, so React state
 * + CSS transitions on `transform` are the right tool (see CategoryDock for
 * the per-frame alternative). Per-card transforms are computed here and
 * written inline; CSS interpolates them.
 *
 * Geometry constants below are component layout (px), not design tokens.
 */

interface Track {
  title:  string;
  artist: string;
}

const TRACKS: Track[] = [
  { title: 'Jammin',        artist: 'RUBII' },
  { title: 'Dedpresidents', artist: 'Knxwledge' },
  { title: 'Bad Company',   artist: 'Yazmin Lacey' },
];

const CARD_H         = 56;   // 32px image + 12px padding top/bottom
const GAP            = 8;    // expanded gap between cards
const PEEK           = 8;    // collapsed peek below each card
const COLLAPSE_STEP  = 0.95; // each collapsed card is 0.95× the one above
const STAGGER        = 40;   // ms per-card animation offset

const N = TRACKS.length;
const M = N - 1;             // animated cards — every track after the anchor

export function RevealStack() {
  const [expanded, setExpanded] = useState(false);

  // Always the expanded footprint — cards are absolutely positioned, so the
  // stack box doesn't need to resize for the collapse/fan visual to read.
  // Keeping it fixed means collapsing never reflows the header row or the
  // article copy below it; only the cards themselves move.
  const stackHeight = CARD_H + M * (CARD_H + GAP);

  return (
    <div className="reveal-stack">
      <div className="reveal-stack__header-row">
        <span className="reveal-stack__title">Up next</span>
        <button
          type="button"
          className="reveal-stack__chevron"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          aria-label={expanded ? 'Collapse up next' : 'Expand up next'}
        >
          {/* Both icons stay mounted and cross opacity/scale/blur on toggle —
              a genuine icon swap, not a rotation of one icon. */}
          <ChevronDown
            className={`reveal-stack__chevron-icon${!expanded ? ' is-visible' : ''}`}
            size={20}
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <ChevronUp
            className={`reveal-stack__chevron-icon${expanded ? ' is-visible' : ''}`}
            size={20}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="reveal-stack__stack" style={{ height: stackHeight }}>
        {TRACKS.map((track, i) => {
          const isAnchor = i === 0;
          const j = i - 1; // 0-indexed position among the animated (post-anchor) tracks

          const scale = isAnchor || expanded ? 1 : COLLAPSE_STEP ** (j + 1);
          const y = isAnchor
            ? 0
            : expanded
              ? CARD_H + GAP + j * (CARD_H + GAP)
              : CARD_H + PEEK * (j + 1) - CARD_H * scale; // bottom peeks PEEK below the card above

          return (
            <article
              key={track.title}
              className="reveal-stack__card"
              style={{
                height:          CARD_H,
                zIndex:          N - i,               // anchor sits above every card behind it
                transform:       `translateY(${y}px) scale(${scale})`,
                transitionDelay: isAnchor ? '0ms' : `${(expanded ? j : M - 1 - j) * STAGGER}ms`,
              }}
            >
              <div className="reveal-stack__thumb" aria-hidden="true" />
              <div className="reveal-stack__text">
                <span className="reveal-stack__track-title">{track.title}</span>
                <span className="reveal-stack__artist">{track.artist}</span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
