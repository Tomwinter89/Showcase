import { useEffect, useRef, useState } from 'react';
import './Bookshelf.css';

import aldebaranImg from '../assets/unsplash/aldebaran-s-uXchDIKs4qI-unsplash.jpg';
import andyImg      from '../assets/unsplash/andy-holmes-rCbdp8VCYhQ-unsplash.jpg';
import diegoImg      from '../assets/unsplash/diego-ph-5LOhydOtTKU-unsplash.jpg';
import jeremyImg     from '../assets/unsplash/jeremy-thomas-E0AHdsENmDg-unsplash.jpg';
import cerqueiraImg  from '../assets/unsplash/shot-by-cerqueira-0o_GEzyargo-unsplash.jpg';

/**
 * BOOKSHELF — a row of book spines that magnify toward the cursor and pull
 * forward into a full cover on click.
 *
 * Two states, two different animation mechanisms, by design:
 * - Hover magnification is per-frame and transform-only (scale + translateX,
 *   never layout) — the exact falloff/gap math from CategoryDock, ported
 *   as-is since both are cursor-driven rows of same-width items.
 * - Click-to-expand is a discrete state change, so it drives actual `width`
 *   via a CSS transition instead. Because spines sit in normal flex flow,
 *   growing one item's width naturally pushes its neighbours outward and
 *   grows the row's scrollWidth — no manual translateX bookkeeping needed
 *   the way the dock's magnification requires.
 *
 * The expanded book itself never receives a magnification transform (its
 * size is fully owned by the width transition), but its still-collapsed
 * neighbours keep magnifying on hover. Since transform doesn't affect layout,
 * their real flex-computed positions (read via offsetLeft/offsetWidth) shift
 * correctly around the wider expanded book with zero extra bookkeeping — the
 * falloff/gap-guarantee cascade just runs once on the left of the expanded
 * book and once on the right, anchored to its live edges instead of the
 * static formula used when nothing is expanded.
 *
 * Two content variants share every line of the above — only what's painted
 * inside each spine differs. 'placeholder' is the original text-only shelf;
 * 'photo' fills each spine with a cover image (Unsplash, credited on tap —
 * name/author are hardcoded placeholders until real EXIF/API data replaces
 * them). Whichever variant is active still needs `title`/`author` for the
 * expand-state credit line, so `PhotoBook` carries them too, just under a
 * separate `number` label instead of a rotated spine.
 */

interface Book {
  id:     string;
  title:  string;
  author: string;
}

interface PhotoBook extends Book {
  number: string;
  image:  string;
}

const BOOKS: Book[] = [
  { id: 'book-1', title: 'Title of the row', author: 'Author goes here' },
  { id: 'book-2', title: 'Title of the row', author: 'Author goes here' },
  { id: 'book-3', title: 'Title of the row', author: 'Author goes here' },
  { id: 'book-4', title: 'Title of the row', author: 'Author goes here' },
  { id: 'book-5', title: 'Title of the row', author: 'Author goes here' },
  { id: 'book-6', title: 'Title of the row', author: 'Author goes here' },
];

// Only 5 source photos exist in src/assets/unsplash — a 6th would mean
// repeating one, which reads as a mistake rather than a deliberate choice.
const PHOTO_BOOKS: PhotoBook[] = [
  { id: 'photo-1', number: '1', image: aldebaranImg, title: 'Title of the row', author: 'Author goes here' },
  { id: 'photo-2', number: '2', image: andyImg,      title: 'Title of the row', author: 'Author goes here' },
  { id: 'photo-3', number: '3', image: diegoImg,     title: 'Title of the row', author: 'Author goes here' },
  { id: 'photo-4', number: '4', image: jeremyImg,    title: 'Title of the row', author: 'Author goes here' },
  { id: 'photo-5', number: '5', image: cerqueiraImg, title: 'Title of the row', author: 'Author goes here' },
];

// Component geometry (px) — layout constants, not design tokens.
const SPINE_W          = 72;    // resting spine width — matches the dock's tile width
const SPINE_H           = 340;   // spine height, constant whether a book is collapsed or expanded
const EXPANDED_W        = 220;   // width once pulled forward
const GAP               = 8;     // px between books — mirrors --space-3
const MAX_SCALE         = 1.1;   // hover magnification peak
const INFLUENCE_RANGE  = 120;   // px falloff radius around the cursor

// The shelf's own box is taller than a resting spine — the padding this
// buys (mirrors --space-8/--space-6 in Bookshelf.css) keeps hover growth and
// shadow bleed inside the clip region. Needed because overflow-x:auto forces
// overflow-y to compute as `auto` too (never truly `visible`), so anything
// that reaches the shelf's own edge gets clipped without this headroom.
const SHELF_PAD_TOP    = 64;
const SHELF_PAD_BOTTOM = 24;

// Rest centres only depend on item count and fixed geometry, not content —
// computed per active dataset (the two variants have different lengths)
// rather than as a single module-level constant.
function computeRestCenters(count: number): number[] {
  return Array.from({ length: count }, (_, i) => i * (SPINE_W + GAP) + SPINE_W / 2);
}

// Raised-cosine falloff: 1 at the centre, smooth ease to 0 at ±range.
function falloff(distance: number, range: number): number {
  const d = Math.abs(distance);
  if (d >= range) return 0;
  return (Math.cos((d / range) * Math.PI) + 1) / 2;
}

// Runs the falloff/gap-guarantee cascade over one contiguous span of
// same-width spines. `restCenters` are absolute, container-relative rest
// positions for just that span (see applyFrame for how each side derives
// them) — everything scales and re-centres within the span's own width,
// exactly like CategoryDock's single-row version.
function cascade(restCentersForSpan: number[], mouseX: number | null) {
  const count = restCentersForSpan.length;
  if (count === 0) return { scales: [] as number[], dxs: [] as number[] };

  const spanLeft  = restCentersForSpan[0] - SPINE_W / 2;
  const spanWidth = count * SPINE_W + (count - 1) * GAP;

  const scales =
    mouseX === null
      ? restCentersForSpan.map(() => 1)
      : restCentersForSpan.map((center) => 1 + (MAX_SCALE - 1) * falloff(mouseX - center, INFLUENCE_RANGE));

  const widths     = scales.map((s) => SPINE_W * s);
  const totalWidth = widths.reduce((sum, w) => sum + w, 0) + (count - 1) * GAP;
  const startLeft  = spanLeft + (spanWidth - totalWidth) / 2;

  const dxs: number[] = [];
  let cursor = startLeft;
  for (let k = 0; k < count; k++) {
    const width        = widths[k];
    const targetCenter = cursor + width / 2;
    dxs.push(targetCenter - restCentersForSpan[k]); // guaranteed-gap translateX
    cursor += width + GAP;
  }

  return { scales, dxs };
}

// Walks a cascade outward from a fixed anchor point instead of centring it
// within a natural span. `cascade` above can let a boundary-adjacent item's
// own growth push its edge past where it started (nothing re-centres to
// compensate for growth at exactly one end) — that's fine for the full row,
// which has no neighbour to collide with, but not for a cascade sitting
// right up against the expanded book. `localRestCenters[0]` must be the
// item closest to the anchor; `direction` is +1 to walk away from the
// anchor rightward (the right-hand cascade), -1 to walk leftward (the
// left-hand cascade, called with its indices reversed).
function anchoredCascade(localRestCenters: number[], anchor: number, direction: 1 | -1, mouseX: number | null) {
  const count = localRestCenters.length;
  const scales =
    mouseX === null
      ? localRestCenters.map(() => 1)
      : localRestCenters.map((center) => 1 + (MAX_SCALE - 1) * falloff(mouseX - center, INFLUENCE_RANGE));

  const dxs: number[] = [];
  let cursor = anchor;
  for (let k = 0; k < count; k++) {
    const width        = SPINE_W * scales[k];
    const targetCenter = cursor + direction * (width / 2);
    dxs.push(targetCenter - localRestCenters[k]);
    cursor += direction * (width + GAP);
  }

  return { scales, dxs };
}

interface BookshelfProps {
  variant?: 'placeholder' | 'photo';
}

export function Bookshelf({ variant = 'placeholder' }: BookshelfProps) {
  const books: Book[] = variant === 'photo' ? PHOTO_BOOKS : BOOKS;
  const restCenters    = computeRestCenters(books.length);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const containerRef     = useRef<HTMLDivElement>(null);
  const spineRefs         = useRef<(HTMLButtonElement | null)[]>([]);
  const reducedMotionRef = useRef(false);
  // Touch devices don't have a cursor that can "leave," which the falloff/
  // gap-guarantee cascade assumes — same reasoning and same fallback as
  // CategoryDock's hoverCapableRef. Click-to-expand is untouched; only the
  // hover-magnification transform is gated behind this.
  const hoverCapableRef  = useRef(true);
  // Absolute clientX from the click that seeds the post-click re-cascade
  // below — deliberately NOT pre-converted to a container-relative delta.
  // .bookshelf isn't scroll-clipped in most layouts; it grows to fit an
  // expanding book, and .bookshelf-demo's justify-content: center then
  // re-centres the now-wider shelf, shifting the container's own left edge
  // by half the width delta. A delta captured against the old edge would be
  // stale by the time the effect runs; clientX itself never moves, so
  // converting it fresh (against whatever edge is current then) is the only
  // value worth caching.
  const lastClickXRef    = useRef<number | null>(null);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    hoverCapableRef.current  = window.matchMedia('(hover: hover)').matches;
  }, []);

  // Switching variants swaps the whole `books` array (different ids) —
  // drop any expanded state from the previous variant rather than leave it
  // dangling on an id that no longer exists in the active dataset.
  useEffect(() => {
    setExpandedId(null);
    lastClickXRef.current = null;
  }, [variant]);

  // Re-run the cursor cascade once an expand/collapse's width change has
  // actually finished — not just committed to the DOM, but visually settled.
  // .bookshelf isn't width-constrained in most layouts, so it grows/shrinks
  // to fit the expanding book, and .bookshelf-demo's justify-content: center
  // then re-centres the whole shelf as that happens — meaning the
  // container's own left edge drifts smoothly for the full 500ms of the
  // spine's width transition (--motion-duration-slow), not in one jump.
  // Sampling it a couple of frames in (the previous approach here) only
  // ever caught a small fraction of that drift, leaving most of the error
  // in place. transitionend on the width property is the actual signal
  // that the layout has stopped moving.
  useEffect(() => {
    if (reducedMotionRef.current || !hoverCapableRef.current) return;
    const container = containerRef.current;
    if (!container) return;

    const recompute = () => {
      const clientX = lastClickXRef.current;
      const viewportX = clientX === null ? null : clientX - container.getBoundingClientRect().left;
      applyFrame(viewportX);
    };

    const handleTransitionEnd = (e: TransitionEvent) => {
      if (e.propertyName === 'width') recompute();
    };
    container.addEventListener('transitionend', handleTransitionEnd);
    return () => container.removeEventListener('transitionend', handleTransitionEnd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedId]);

  // Bring a newly expanded book into view — it may sit past the visible
  // edge of the row once the shelf grows wider than its frame.
  useEffect(() => {
    if (expandedId === null) return;
    const index = books.findIndex((b) => b.id === expandedId);
    spineRefs.current[index]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [expandedId]);

  const applyFrame = (viewportX: number | null) => {
    if (reducedMotionRef.current || !hoverCapableRef.current) return;

    // restCenters/offsetLeft are content-space (scroll-independent), but
    // viewportX is measured from the container's own visible edge — the two
    // only line up while scrollLeft is 0. Expanding a book can scroll the
    // shelf (see the scrollIntoView effect below) and collapsing never
    // scrolls it back, so a mouse that never moves can still end up over a
    // different book than before purely because the content slid under it.
    // Re-deriving this on every call (rather than once at click time) also
    // covers the browser re-clamping scrollLeft mid-collapse as the row
    // narrows back down.
    const mouseX = viewportX === null ? null : viewportX + (containerRef.current?.scrollLeft ?? 0);

    const expandedIndex = expandedId === null ? -1 : books.findIndex((b) => b.id === expandedId);

    if (expandedIndex === -1) {
      const { scales, dxs } = cascade(restCenters, mouseX);
      books.forEach((_, i) => {
        const spine = spineRefs.current[i];
        if (spine) spine.style.transform = `translateX(${dxs[i]}px) scale(${scales[i]})`;
      });
      return;
    }

    // The expanded book isn't part of either cascade (its width comes from
    // the transition, not the gap-guarantee math), but it still magnifies
    // toward the cursor on its own. Its transform-origin is its own centre,
    // so growth is symmetric — half the extra width goes to each side, and
    // that half is added to the anchor each cascade below gets pinned to.
    const expandedEl = spineRefs.current[expandedIndex];
    let growth = 0;
    if (expandedEl) {
      const center = expandedEl.offsetLeft + expandedEl.offsetWidth / 2;
      const scale  = mouseX === null ? 1 : 1 + (MAX_SCALE - 1) * falloff(mouseX - center, INFLUENCE_RANGE);
      expandedEl.style.transform = `scale(${scale})`;
      growth = (expandedEl.offsetWidth * scale - expandedEl.offsetWidth) / 2;
    }

    const leftIndices  = books.map((_, i) => i).slice(0, expandedIndex);
    const rightIndices = books.map((_, i) => i).slice(expandedIndex + 1);

    // Left cascade: reversed so index 0 is the item closest to the expanded
    // book — anchoredCascade pins that item's edge to the boundary and walks
    // leftward (direction -1), so it can never grow past the gap no matter
    // which item in the span is currently magnified.
    if (leftIndices.length > 0 && expandedEl) {
      const anchor    = expandedEl.offsetLeft - GAP - growth;
      const reversed  = [...leftIndices].reverse();
      // Live offsetLeft, not the static `restCenters` formula — that formula
      // assumes the row starts at coordinate 0, but .bookshelf has its own
      // left padding, so real layout positions sit 16px further right. That
      // bias is invisible when a cascade only ever compares against itself
      // (the no-expansion case, and the right cascade's anchor-built
      // centers), but mixing it with the correctly-measured `anchor` here
      // would silently reintroduce exactly that 16px error.
      const centers = reversed.map((i) => (spineRefs.current[i]?.offsetLeft ?? 0) + SPINE_W / 2);
      const { scales, dxs } = anchoredCascade(centers, anchor, -1, mouseX);
      reversed.forEach((bookIndex, k) => {
        const spine = spineRefs.current[bookIndex];
        if (spine) spine.style.transform = `translateX(${dxs[k]}px) scale(${scales[k]})`;
      });
    }

    // Right cascade: already index-0-closest-to-boundary by construction,
    // walks rightward (direction +1) from the same kind of pinned anchor.
    //
    // `centers` must be built from the expanded book's TRUE (un-grown)
    // edge, not the growth-adjusted position anchor below — they're used as
    // the falloff/dx baseline, and if growth leaked into them too, an
    // unmagnified neighbour's dx would net back to 0 (target and baseline
    // shifting together), silently cancelling out the very push that
    // growth is supposed to cause.
    if (rightIndices.length > 0 && expandedEl) {
      const trueRight     = expandedEl.offsetLeft + expandedEl.offsetWidth + GAP;
      const positionAnchor = trueRight + growth;
      const centers = rightIndices.map((_, k) => trueRight + k * (SPINE_W + GAP) + SPINE_W / 2);
      const { scales, dxs } = anchoredCascade(centers, positionAnchor, 1, mouseX);
      rightIndices.forEach((bookIndex, k) => {
        const spine = spineRefs.current[bookIndex];
        if (spine) spine.style.transform = `translateX(${dxs[k]}px) scale(${scales[k]})`;
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = containerRef.current!.getBoundingClientRect();
    applyFrame(e.clientX - bounds.left);
  };

  const handleMouseLeave = () => applyFrame(null);

  const handleClick = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    lastClickXRef.current = e.clientX;

    // Clear every OTHER spine's transform — they're about to be repositioned
    // by the cascade math and shouldn't carry stale hover state into it. The
    // clicked spine keeps whatever transform it already had (its current
    // hover magnification) so it doesn't snap to scale(1) before the effect
    // above recomputes it against the new layout — it eases there instead,
    // via the same CSS transition that already drives normal hover moves.
    spineRefs.current.forEach((spine, i) => {
      if (spine && books[i].id !== id) spine.style.transform = 'translateX(0) scale(1)';
    });
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
    <div
      ref={containerRef}
      className="bookshelf"
      style={{ height: SPINE_H + SHELF_PAD_TOP + SHELF_PAD_BOTTOM }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {books.map((book, i) => {
        const isExpanded = book.id === expandedId;
        return (
          <button
            key={book.id}
            ref={(node) => { spineRefs.current[i] = node; }}
            type="button"
            className={`bookshelf__book${isExpanded ? ' is-expanded' : ''}`}
            style={{ width: isExpanded ? EXPANDED_W : SPINE_W }}
            onClick={(e) => handleClick(book.id, e)}
            aria-expanded={isExpanded}
          >
            {variant === 'photo' ? (
              <>
                <img className="bookshelf__photo" src={(book as PhotoBook).image} alt="" draggable={false} />
                <span className="bookshelf__photo-scrim" aria-hidden="true" />
                <span className="bookshelf__number-row">
                  <span className="bookshelf__number">{(book as PhotoBook).number}</span>
                  <span className="bookshelf__photo-credit" aria-hidden={!isExpanded}>
                    <strong>{book.title}</strong>
                    <span>{book.author}</span>
                  </span>
                </span>
              </>
            ) : (
              <>
                <span className="bookshelf__spine-label" aria-hidden={isExpanded}>
                  <strong>{book.title}</strong>
                  <span>{book.author}</span>
                </span>

                <span className="bookshelf__cover" aria-hidden={!isExpanded}>
                  <span className="bookshelf__cover-image" aria-hidden="true" />
                  <span className="bookshelf__cover-text">
                    <strong>{book.title}</strong>
                    <span>{book.author}</span>
                  </span>
                </span>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}
