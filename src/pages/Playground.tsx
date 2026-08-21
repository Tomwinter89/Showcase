import { useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebHaptics } from 'web-haptics/react';
import { FeaturePreview } from '../components/FeaturePreview';
import { SheetStackCover } from '../components/SheetStackCover';
import { StackRevealCover } from '../components/StackRevealCover';
import { FEATURES, TOTAL_FEATURES } from '../data/features';
import { navigateWithTransition } from '../utils/navigation';
import { useClickSound } from '../hooks/useClickSound';
import './Playground.css';

export { TOTAL_FEATURES };

interface PlaygroundProps {
  currentIndex: number;
  onNavigate:   (index: number) => void;
}

const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;

export function Playground({ currentIndex, onNavigate }: PlaygroundProps) {
  const navigate            = useNavigate();
  const scrollRef           = useRef<HTMLDivElement>(null);
  const slideRefs           = useRef<(HTMLDivElement | null)[]>([]);
  const isProgrammatic      = useRef(false);
  const programmaticTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { trigger: triggerSound }  = useClickSound();
  const { trigger: triggerHaptic } = useWebHaptics();

  const currentIndexRef = useRef(currentIndex);
  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);

  const prevIndexRef = useRef<number | null>(null);

  // ── Effect 1: programmatic scroll when currentIndex changes ─────────────────
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    isProgrammatic.current = true;

    if (isDesktop()) {
      container.scrollTo({ top: currentIndex * container.clientHeight, behavior: 'smooth' });
    } else {
      container.scrollTo({ left: currentIndex * container.clientWidth, behavior: 'smooth' });
    }

    if (programmaticTimer.current) clearTimeout(programmaticTimer.current);
    programmaticTimer.current = setTimeout(() => { isProgrammatic.current = false; }, 800);
    return () => { if (programmaticTimer.current) clearTimeout(programmaticTimer.current); };
  }, [currentIndex]);

  // ── Effect 2: IntersectionObserver — mobile swipe updates sidebar state ─────
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammatic.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = slideRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) onNavigate(index);
          }
        });
      },
      { root: container, threshold: 0.6 }
    );

    slideRefs.current.forEach((slide) => { if (slide) observer.observe(slide); });
    return () => observer.disconnect();
  }, [onNavigate]);

  // ── Effect 3: entrance/exit animation — manages is-entering class ───────────
  useEffect(() => {
    const slide = slideRefs.current[currentIndex];
    if (!slide) return;

    if (prevIndexRef.current !== null && prevIndexRef.current !== currentIndex) {
      slideRefs.current[prevIndexRef.current]?.classList.remove('is-entering');
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        triggerSound();
        triggerHaptic('selection');
      }
    }
    prevIndexRef.current = currentIndex;

    slide.classList.remove('is-entering');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { slide.classList.add('is-entering'); });
    });
  }, [currentIndex]);

  // ── Effect 4: wheel navigation (desktop vertical + mobile horizontal) ────────
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let accumulated = 0;
    let inCooldown  = false;
    let resetTimer: ReturnType<typeof setTimeout> | null = null;

    const handleWheel = (e: WheelEvent) => {
      const desktop = isDesktop();
      if (desktop) {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      } else {
        if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
      }

      e.preventDefault();
      if (inCooldown) return;

      const delta = desktop ? e.deltaY : e.deltaX;
      accumulated += delta;

      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => { accumulated = 0; }, 150);

      if (Math.abs(accumulated) < 50) return;

      const direction = accumulated > 0 ? 1 : -1;
      const next = Math.max(0, Math.min(FEATURES.length - 1, currentIndexRef.current + direction));
      accumulated = 0;
      if (next === currentIndexRef.current) return;

      inCooldown = true;
      onNavigate(next);
      setTimeout(() => { inCooldown = false; }, 800);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [onNavigate]);

  // ── Effect 5: touch navigation (mobile — card follows finger, snaps on release)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let touchStartX    = 0;
    let scrollStartLeft = 0;
    let velocity       = 0;
    let lastX          = 0;
    let lastTime       = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (isDesktop()) return;
      touchStartX     = e.touches[0].clientX;
      scrollStartLeft = container.scrollLeft;
      lastX           = touchStartX;
      lastTime        = performance.now();
      velocity        = 0;
      isProgrammatic.current = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDesktop()) return;
      e.preventDefault();
      const x   = e.touches[0].clientX;
      const now = performance.now();
      const dt  = now - lastTime;
      if (dt > 0) velocity = (lastX - x) / dt;
      lastX    = x;
      lastTime = now;
      container.scrollLeft = scrollStartLeft + (touchStartX - x);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isDesktop()) return;
      const slideWidth = container.clientWidth;
      const deltaX     = touchStartX - e.changedTouches[0].clientX;
      const isFlick    = Math.abs(velocity) > 0.3;
      const isDrag     = Math.abs(deltaX) > slideWidth * 0.3;

      let targetIndex = currentIndexRef.current;
      if (isFlick || isDrag) {
        const dir = (velocity > 0 || deltaX > 0) ? 1 : -1;
        targetIndex = Math.max(0, Math.min(FEATURES.length - 1, currentIndexRef.current + dir));
      }

      container.scrollTo({ left: targetIndex * slideWidth, behavior: 'smooth' });
      onNavigate(targetIndex);

      if (programmaticTimer.current) clearTimeout(programmaticTimer.current);
      programmaticTimer.current = setTimeout(() => { isProgrammatic.current = false; }, 800);
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove',  handleTouchMove,  { passive: false });
    container.addEventListener('touchend',   handleTouchEnd,   { passive: true });
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove',  handleTouchMove);
      container.removeEventListener('touchend',   handleTouchEnd);
    };
  }, [onNavigate]);

  const handleFeatureNavigate = useCallback((id: string) => {
    navigateWithTransition(navigate, `/feature/${id}`);
  }, [navigate]);

  return (
    <div className="playground-scroll" ref={scrollRef}>
      {FEATURES.map((feature, i) => (
        <div
          key={feature.id}
          className="playground-slide"
          ref={(el) => { slideRefs.current[i] = el; }}
        >
          <FeaturePreview
            title={feature.title}
            subtitle={feature.subtitle}
            featureId={feature.id}
            cover={
              feature.id === 'sheet-stacking' ? <SheetStackCover /> :
              feature.id === 'stack-reveal'   ? <StackRevealCover /> :
              undefined
            }
            onNavigate={() => handleFeatureNavigate(feature.id)}
          />
        </div>
      ))}
    </div>
  );
}
