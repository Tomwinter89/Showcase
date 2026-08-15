import { useEffect, useRef } from 'react';
import './CategoryDock.css';

import applesImg   from '../assets/images/fruit/Apples.png';
import bananasImg  from '../assets/images/fruit/Bananas.png';
import citrusImg   from '../assets/images/fruit/Citrus.png';
import berriesImg  from '../assets/images/fruit/Berries.png';
import melonsImg   from '../assets/images/fruit/Melons.png';
import mangoesImg  from '../assets/images/fruit/Mangos.png';
import avocadosImg from '../assets/images/fruit/Avocados.png';

import jesseImg     from '../assets/images/characters/Jesse.png';
import elsaImg       from '../assets/images/characters/Elsa.png';
import bullseyeImg   from '../assets/images/characters/Bullseye.png';
import moanaImg       from '../assets/images/characters/Moana.png';
import spidermanImg   from '../assets/images/characters/Spiderman.png';
import chickenImg     from '../assets/images/characters/Chicken.png';
import thingImg       from '../assets/images/characters/Thing.png';

/**
 * CATEGORY DOCK — cursor-driven magnification (macOS-dock style).
 *
 * Animation follows the codebase's established imperative pattern (see the
 * About page drum + hover thumbnail): mousemove writes straight to each
 * item's `ref.current.style.transform`, never through React state, so the
 * component doesn't re-render on every pixel of cursor movement. Only
 * `transform` (translateX + scale) changes — compositor-only, no layout.
 *
 * `transform-origin: center bottom` (set in CSS) scales each item from its
 * bottom edge, so every item stays on a shared baseline while magnifying.
 *
 * GAP GUARANTEE: because the origin is horizontally centred, scaling never
 * moves an item's centre — only translateX does. We compute where each
 * item's centre SHOULD sit (cumulative sum of scaled widths + fixed GAP),
 * subtract its resting centre, and write that delta as translateX. The 4px
 * gap is mathematically preserved at any magnification.
 *
 * `prefers-reduced-motion` is read once on mount; when set, applyFrame is a
 * no-op and every item sits at rest — same fallback strategy as the drum.
 * `(hover: hover)` gets the same treatment: the falloff math is built around
 * a cursor that can arrive and later leave, which touch has no equivalent
 * for, so magnification stays off there rather than getting stuck mid-swell
 * after a tap (touch browsers can fire one synthetic mousemove per tap with
 * no matching "leave").
 *
 * TWO VARIANTS, same interaction engine:
 * - 'tile'  (default) — each item is a raised square tile with an image
 *   inside it. Used for the fruit/category picker.
 * - 'bar'   — items have no per-item chrome; the image itself is the dock
 *   item, floating over a single shared `.raised-surface` bar. Because the
 *   bar is exactly as tall as a resting item and items still grow upward
 *   from `transform-origin: center bottom`, magnified items naturally peek
 *   above the bar's top edge — no extra positioning logic needed, only a
 *   lower z-index on the bar so items always paint in front of it.
 */

// Component geometry (px) — layout constants, not design tokens.
const GEOMETRY = {
  tile: { width: 72, height: 72 },   // resting tile edge (square)
  bar:  { width: 56, height: 62 },   // resting character image box (aspect-preserved)
} as const;
const IMAGE_SIZE      = 56;   // tile variant only — image edge inside the 72px tile
const MAX_SCALE       = 1.3;  // magnification at the cursor
const INFLUENCE_RANGE = 150;  // px falloff radius around the cursor
const GAP             = 4;    // px between items — mirrors --space-2 / CSS gap
const HIDDEN_NUDGE    = 3;    // px the tooltip sits lower while hidden (animates up on reveal)
const BAR_PADDING     = 24;   // px the bar variant's bar reaches past the item row on each side — mirrors --space-6

export interface DockItem {
  name: string;
  src:  string;
}

export const FRUIT_ITEMS: DockItem[] = [
  { name: 'Apples',   src: applesImg   },
  { name: 'Bananas',  src: bananasImg  },
  { name: 'Citrus',   src: citrusImg   },
  { name: 'Berries',  src: berriesImg  },
  { name: 'Melons',   src: melonsImg   },
  { name: 'Mangoes',  src: mangoesImg  },
  { name: 'Avocados', src: avocadosImg },
];

export const CHARACTER_ITEMS: DockItem[] = [
  { name: 'Jesse',     src: jesseImg     },
  { name: 'Elsa',      src: elsaImg      },
  { name: 'Bullseye',  src: bullseyeImg  },
  { name: 'Moana',     src: moanaImg     },
  { name: 'Spiderman', src: spidermanImg },
  { name: 'Chicken',   src: chickenImg   },
  { name: 'Thing',     src: thingImg     },
];

interface CategoryDockProps {
  variant?: 'tile' | 'bar';
  items?:   DockItem[];
}

// Raised-cosine falloff: 1 at the centre, smooth ease to 0 at ±range.
function falloff(distance: number, range: number): number {
  const d = Math.abs(distance);
  if (d >= range) return 0;
  return (Math.cos((d / range) * Math.PI) + 1) / 2;
}

export function CategoryDock({ variant = 'tile', items = FRUIT_ITEMS }: CategoryDockProps) {
  const { width: REST_W, height: REST_H } = GEOMETRY[variant];

  const containerRef     = useRef<HTMLDivElement>(null);
  const barRef           = useRef<HTMLDivElement>(null);          // bar variant only — owns width
  const wrapperRefs      = useRef<(HTMLDivElement | null)[]>([]); // z-index + tooltip context
  const tileRefs         = useRef<(HTMLElement | null)[]>([]);    // owns transform only
  const tooltipRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotionRef = useRef(false);
  const hoverCapableRef  = useRef(true);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    hoverCapableRef.current  = window.matchMedia('(hover: hover)').matches;
  }, []);

  const N = items.length;
  const REST_TOTAL_WIDTH = N * REST_W + (N - 1) * GAP;

  // Resting centre of each item, container-relative px — fixed, never recalculated.
  const restCenters = items.map((_, i) => i * (REST_W + GAP) + REST_W / 2);

  // Imperative frame update — no setState, no re-render. Called from the handlers.
  const applyFrame = (mouseX: number | null) => {
    if (reducedMotionRef.current || !hoverCapableRef.current) return; // fallback: never magnify

    const scales =
      mouseX === null
        ? items.map(() => 1)
        : restCenters.map((center) => {
            const f = falloff(mouseX - center, INFLUENCE_RANGE);
            return 1 + (MAX_SCALE - 1) * f;
          });

    const widths     = scales.map((s) => REST_W * s);
    const totalWidth = widths.reduce((sum, w) => sum + w, 0) + (N - 1) * GAP;
    const startLeft  = (REST_TOTAL_WIDTH - totalWidth) / 2;

    // Bar variant: the shared surface tracks the row's current magnified
    // width, same as a real macOS dock's pill swelling under the cursor.
    if (barRef.current) barRef.current.style.width = `${totalWidth + BAR_PADDING * 2}px`;

    // Single "hovered" item — highest scale wins; every other tooltip stays hidden.
    let hoveredIndex = -1;
    if (mouseX !== null) {
      let best = -Infinity;
      scales.forEach((s, i) => {
        if (s > best) { best = s; hoveredIndex = i; }
      });
    }

    let cursor = startLeft;
    for (let i = 0; i < N; i++) {
      const width        = widths[i];
      const targetCenter = cursor + width / 2;
      const dx           = targetCenter - restCenters[i]; // guaranteed-gap translateX

      const wrapper = wrapperRefs.current[i];
      if (wrapper) wrapper.style.zIndex = String(Math.round(scales[i] * 100));

      const tile = tileRefs.current[i];
      if (tile) tile.style.transform = `translateX(${dx}px) scale(${scales[i]})`;

      const tooltip = tooltipRefs.current[i];
      if (tooltip) {
        const isProminent = i === hoveredIndex && scales[i] > 1.05;
        tooltip.style.left      = `${REST_W / 2 + dx}px`; // local coords, wrapper-relative
        tooltip.style.opacity   = isProminent ? '1' : '0';
        tooltip.style.transform = isProminent
          ? 'translate(-50%, -100%) scale(1)'
          : `translate(-50%, calc(-100% + ${HIDDEN_NUDGE}px)) scale(0.95)`;
      }

      cursor += width + GAP;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = containerRef.current!.getBoundingClientRect();
    applyFrame(e.clientX - bounds.left);
  };

  const handleMouseLeave = () => applyFrame(null);

  return (
    <div
      ref={containerRef}
      className={`category-dock category-dock--${variant}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {variant === 'bar' && (
        <div
          ref={barRef}
          className="category-dock__bar raised-surface"
          style={{ height: REST_H, width: REST_TOTAL_WIDTH + BAR_PADDING * 2 }}
          aria-hidden="true"
        />
      )}

      {items.map((item, i) => (
        <div
          key={item.name}
          ref={(node) => { wrapperRefs.current[i] = node; }}
          className="category-dock__item"
          style={{ width: REST_W, height: REST_H }}
        >
          <div
            ref={(node) => { tooltipRefs.current[i] = node; }}
            className="category-dock__tooltip"
          >
            {item.name}
          </div>

          {/* alt="" — the tooltip already carries the item name; draggable off
              so dragging an image never hijacks the mousemove tracking. */}
          {variant === 'tile' ? (
            <div
              ref={(node) => { tileRefs.current[i] = node; }}
              className="category-dock__tile"
              style={{ width: REST_W, height: REST_H }}
            >
              <img
                className="category-dock__image"
                src={item.src}
                alt=""
                draggable={false}
                style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}
              />
            </div>
          ) : (
            <img
              ref={(node) => { tileRefs.current[i] = node; }}
              className="category-dock__character"
              src={item.src}
              alt=""
              draggable={false}
              style={{ width: REST_W, height: REST_H }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
