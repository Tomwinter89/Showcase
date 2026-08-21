import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { TRACKS } from '../data/upNextTracks';
import './StackRevealFan.css';

/**
 * STACK REVEAL FAN — second variant of the Stack Reveal feature. Same
 * "up next" queue (see data/upNextTracks.ts) as StackReveal, a completely
 * different presentation: a square stack sits centred in its container:
 * tap it, and a blurred full-viewport scrim overlays the page while the
 * stack fans out into a horizontal row. Tap the scrim (or Escape) to
 * collapse back into the stack.
 *
 * The overlay lifecycle (portal, mount/close-delay, Escape, focus trap,
 * body scroll lock via the shared .is-sheet-open class) is modelled
 * directly on Sheet.tsx/NavMenu.tsx — this is the same category of thing,
 * a modal overlay, just centred and horizontal instead of edge-anchored.
 * The blurred (not just dimmed) scrim specifically follows NavMenu's
 * backdrop-filter treatment rather than Sheet's plain dim, since that's
 * what this variant's reference design calls for — just in the site's
 * normal light theme rather than NavMenu's deliberate dark inversion.
 *
 * The fan/cascade math is StackReveal's own formula rotated 90° — scale
 * 0.95 per collapsed step, PEEK-px peek — just along X instead of Y, and
 * with a real anchor tile (the "Up next" cover) that isn't a track, rather
 * than repurposing the first track as the anchor. Because the collapsed
 * trigger (always inline in the page) and the expanded row (portaled,
 * centred in the viewport) are never the same DOM subtree, there's no
 * shared-element morph between them — the row runs its own collapsed→
 * expanded animation on mount instead, independent of the trigger's own
 * (static) position on the page.
 */

const TILE           = 140;  // square tile edge, px
const GAP            = 8;    // expanded gap between tiles — mirrors StackReveal's GAP
const PEEK           = 8;    // collapsed peek — mirrors StackReveal's PEEK
const COLLAPSE_STEP  = 0.95; // each collapsed tile is 0.95× the one above — same as StackReveal
const STAGGER        = 40;   // ms per-tile animation offset — mirrors StackReveal's STAGGER
const TEXT_H         = 52;   // reserved height below each track tile for title/artist
const CLOSE_DELAY_MS = 340;  // matches Sheet's close-then-unmount delay

const N = TRACKS.length;         // 3 tracks — the cover tile is a separate, non-track anchor
const ROW_H = TILE + 8 + TEXT_H; // row's fixed footprint — tallest tile (image + text) sets it

// Collapsed-cascade position for the j-th track (0-indexed, behind the
// cover) — shared between the always-visible trigger preview and the
// overlay's own collapsed starting state so they read as the same shape.
function collapsedTransform(j: number) {
  const scale = COLLAPSE_STEP ** (j + 1);
  const x     = TILE + PEEK * (j + 1) - TILE * scale;
  return { x, scale };
}

export function StackRevealFan() {
  const [isOpen, setIsOpen]         = useState(false);
  const [isMounted, setIsMounted]   = useState(false);
  const [isClosing, setIsClosing]   = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const panelRef      = useRef<HTMLDivElement>(null);
  const prevFocusRef  = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mount / unmount with animation delay — same shape as Sheet/NavMenu.
  useEffect(() => {
    if (isOpen) {
      prevFocusRef.current = document.activeElement as HTMLElement | null;
      setIsMounted(true);
      setIsClosing(false);
    } else if (isMounted) {
      setIsExpanded(false); // start the fan collapsing immediately
      setIsClosing(true);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      closeTimerRef.current = setTimeout(() => {
        setIsMounted(false);
        setIsClosing(false);
      }, CLOSE_DELAY_MS);
    }
    return () => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current); };
  }, [isOpen]);

  // Once actually mounted, flip to expanded a frame later so the row
  // renders collapsed first and animates open, rather than starting fanned.
  useEffect(() => {
    if (!isMounted) return;
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsExpanded(true));
    });
    return () => cancelAnimationFrame(raf);
  }, [isMounted]);

  // Focus + body scroll lock — .is-sheet-open is a generic "an overlay is
  // open" lock (see NavMenu), not specific to Sheet despite the name.
  useEffect(() => {
    if (!isMounted) return;
    document.body.classList.add('is-sheet-open');
    panelRef.current?.focus();
    return () => {
      document.body.classList.remove('is-sheet-open');
      prevFocusRef.current?.focus();
    };
  }, [isMounted]);

  // Escape closes
  useEffect(() => {
    if (!isMounted) return;
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMounted]);

  // Tab focus trap — cycle within the row only
  useEffect(() => {
    if (!isMounted || !panelRef.current) return;
    const panel = panelRef.current;
    const sel   = 'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(sel));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleTab);
    return () => window.removeEventListener('keydown', handleTab);
  }, [isMounted]);

  const rowWidth = TILE + N * (TILE + GAP);

  return (
    <div className="stack-reveal-fan">
      <button
        type="button"
        className="stack-reveal-fan__trigger"
        style={{ width: TILE, height: TILE }}
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label="Show up next queue"
      >
        <span className="stack-reveal-fan__cover" style={{ width: TILE, height: TILE, zIndex: N + 1 }}>
          <span className="stack-reveal-fan__cover-label">Up<br />next</span>
        </span>
        {TRACKS.map((_, j) => {
          const { x, scale } = collapsedTransform(j);
          return (
            <span
              key={j}
              className="stack-reveal-fan__peek"
              style={{
                width:     TILE,
                height:    TILE,
                transform: `translateX(${x}px) scale(${scale})`,
                zIndex:    N - j,
              }}
              aria-hidden="true"
            />
          );
        })}
      </button>

      {isMounted && createPortal(
        <div className={`stack-reveal-fan__overlay${isClosing ? ' is-closing' : ''}`}>
          <div className="stack-reveal-fan__scrim" onClick={() => setIsOpen(false)} aria-hidden="true" />
          <div
            className="stack-reveal-fan__row"
            role="dialog"
            aria-modal="true"
            aria-label="Up next queue"
            tabIndex={-1}
            ref={panelRef}
          >
            {/* Outer .row scrolls (mobile, where rowWidth exceeds the
                viewport); this inner element is the fixed-width cascade
                coordinate space the absolutely-positioned tiles live in. */}
            <div className="stack-reveal-fan__row-inner" style={{ width: rowWidth, height: ROW_H }}>
              <div
                className="stack-reveal-fan__cover-tile"
                style={{ width: TILE, height: TILE, zIndex: N + 1 }}
              >
                <span className="stack-reveal-fan__cover-label">Up<br />next</span>
              </div>

              {TRACKS.map((track, j) => {
                const collapsed = collapsedTransform(j);
                const scale = isExpanded ? 1 : collapsed.scale;
                const x     = isExpanded ? TILE + GAP + j * (TILE + GAP) : collapsed.x;

                return (
                  <article
                    key={track.title}
                    className="stack-reveal-fan__tile"
                    style={{
                      width:           TILE,
                      transform:       `translateX(${x}px) scale(${scale})`,
                      transitionDelay: `${(isExpanded ? j : N - 1 - j) * STAGGER}ms`,
                      zIndex:          N - j,
                    }}
                  >
                    <div className="stack-reveal-fan__art" style={{ width: TILE, height: TILE }} aria-hidden="true" />
                    <div className="stack-reveal-fan__text">
                      <span className="stack-reveal-fan__track-title">{track.title}</span>
                      <span className="stack-reveal-fan__artist">{track.artist}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
