import { useRef, useEffect, useCallback, useState } from 'react';
import './About.css';

interface Item {
  text:      string;
  imageSrc?: string;
}

const ITEMS: Item[] = [
  { text: 'A FATHER OF TWO' },
  { text: 'A HUSBAND' },
  { text: 'LIVING IN SOUTH WEST, WA' },
  { text: 'FROM CAVES BEACH, NSW' },
  { text: 'BUILDING IN CODE' },
  { text: 'TINKERING ON THIS WEBSITE' },
  { text: 'CRAFTING PLAYLISTS' },
  { text: 'BUILDING AN IOS LIST APP' },
  { text: 'PULLING WEEDS' },
  { text: 'GETTING THE FIRE GOING' },
  { text: 'CHOPPING WOOD' },
  { text: 'POURING RED WINE' },
  { text: 'SPINNING VINYL' },
  { text: 'LEARNING NEW TOOLS' },
  { text: 'OFTEN CAMPING',              imageSrc: '/images/about/camping.jpg' },
  { text: 'PROBABLY SURFING RIGHT NOW', imageSrc: '/images/about/surfing.jpg' },
  { text: 'DETACHING INSTANCE' },
  { text: 'COLLABORATING CLOSELY WITH DEVS' },
  { text: 'META PROMPTING' },
  { text: 'CHANGING A NAPPIE' },
  { text: 'AT THE BEACH WITH MY DOG',   imageSrc: '/images/about/dog-beach.jpg' },
  { text: 'SWEATING THE DETAILS' },
  { text: 'INSPECTING ELEMENT' },
];

// Drum geometry
const TOTAL_DURATION   = 30_000;  // ms for one full loop
const VISIBLE_COUNT    = 13;      // slots rendered in the window
const LINE_SLOT        = 58;      // px per slot
const MAX_CURVE_OFFSET = 56;      // px horizontal pull-back at edges
const MAX_ROTATE_X     = 55;      // degrees of tilt
const ITEM_LEFT        = MAX_CURVE_OFFSET + 8;  // abs left for all items (64px)

export function About() {
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef       = useRef<number | null>(null);
  const imgRef       = useRef<HTMLImageElement>(null);

  // Drum animation — skipped if prefers-reduced-motion
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = (timestamp - startTimeRef.current) % TOTAL_DURATION;
      setProgress((elapsed / TOTAL_DURATION) * ITEMS.length);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  // Page-level mousemove — tracks cursor for the floating thumbnail
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const img = imgRef.current;
      if (img && img.style.visibility === 'visible') {
        img.style.left = `${e.clientX}px`;
        img.style.top  = `${e.clientY}px`;
      }
    };
    document.addEventListener('mousemove', onMove);
    return () => document.removeEventListener('mousemove', onMove);
  }, []);

  const handleMouseEnter = useCallback((src: string) => {
    const img = imgRef.current;
    if (!img) return;
    img.src              = src;
    img.style.visibility = 'visible';
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (imgRef.current) imgRef.current.style.visibility = 'hidden';
  }, []);

  const centreSlot = VISIBLE_COUNT / 2;
  const drumHeight = VISIBLE_COUNT * LINE_SLOT;

  return (
    <div className="about">
      <div className="about__left">
        <h1 className="about__heading">I'm a product designer who is</h1>
      </div>

      <div className="about__right">
        {/* Drum mask — fades top/bottom only; overflow: visible lets arc extend left */}
        <div
          style={{
            position:           'relative',
            height:             `${drumHeight}px`,
            width:              '100%',
            overflow:           'visible',
            maskImage:          'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)',
            WebkitMaskImage:    'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)',
          }}
        >
          {Array.from({ length: VISIBLE_COUNT + 6 }, (_, i) => {
            const lineIndex    = Math.floor(progress - centreSlot) + i;
            const wrappedIndex = ((lineIndex % ITEMS.length) + ITEMS.length) % ITEMS.length;
            const item         = ITEMS[wrappedIndex];

            const distance    = lineIndex - progress;
            const absDistance = Math.abs(distance);
            if (absDistance > centreSlot + 1) return null;

            const normalised  = distance / centreSlot;
            const translateY  = (distance + centreSlot) * LINE_SLOT;
            const curveFactor = Math.cos((normalised * Math.PI) / 2);
            const translateX  = -(1 - curveFactor) * MAX_CURVE_OFFSET;
            const rotateX     = normalised * -MAX_ROTATE_X;
            const opacity     = Math.max(0, 1 - absDistance / (centreSlot * 0.85));

            return (
              <div
                key={String(lineIndex)}
                style={{
                  position:        'absolute',
                  top:             0,
                  left:            `${ITEM_LEFT}px`,
                  height:          `${LINE_SLOT}px`,
                  display:         'flex',
                  alignItems:      'center',
                  opacity,
                  whiteSpace:      'nowrap',
                  transform:       `translateY(${translateY}px) translateX(${translateX}px) perspective(700px) rotateX(${rotateX}deg)`,
                  transformOrigin: 'left center',
                }}
                onMouseEnter={item.imageSrc ? () => handleMouseEnter(item.imageSrc!) : undefined}
                onMouseLeave={item.imageSrc ? handleMouseLeave : undefined}
              >
                <span className="about__item">{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      <img
        ref={imgRef}
        className="about__hover-image"
        src=""
        alt=""
        aria-hidden="true"
        style={{ visibility: 'hidden' }}
      />
    </div>
  );
}
