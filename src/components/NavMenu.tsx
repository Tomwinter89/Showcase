import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { navigateWithTransition } from '../utils/navigation';
import './NavMenu.css';

/**
 * NAV_MENU — full-viewport blurred overlay with large, left-to-right
 * staggered nav items. Structurally mirrors Sheet.tsx (portal, Escape,
 * focus trap, body scroll lock via the same .is-sheet-open class — it's a
 * generic "an overlay is open" lock, not sheet-specific) since this is the
 * same category of thing: a modal overlay, just a different shape.
 *
 * `path: undefined` means the destination doesn't exist yet — the item
 * still renders and closes the menu on click, it just doesn't navigate.
 *
 * `heroIndex` marks one character (by position in `label`, before any CSS
 * text-transform) to render in Aktura instead of the system sans; `heroAlt`
 * (default true) additionally applies Aktura's `salt` stylistic alternate
 * to that character. See NavMenu.css for the accent treatment itself.
 */
interface NavItem {
  label: string;
  path?: string;
  heroIndex?: number;
  heroAlt?:   boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home',  path: '/',      heroIndex: 1 },                 // o — alt
  { label: 'About', path: '/about', heroIndex: 4, heroAlt: false }, // t — default Aktura glyph, no alt
  { label: 'Career',                heroIndex: 1 },                 // a — alt
  { label: 'Testimonials',          heroIndex: 6 },                 // o — alt
];

const CLOSE_DELAY_MS = 260;

interface NavMenuProps {
  isOpen:  boolean;
  onClose: () => void;
}

export function NavMenu({ isOpen, onClose }: NavMenuProps) {
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const panelRef       = useRef<HTMLElement>(null);
  const prevFocusRef   = useRef<HTMLElement | null>(null);
  const closeTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Mount / unmount with animation delay — same shape as Sheet's.
  useEffect(() => {
    if (isOpen) {
      prevFocusRef.current = document.activeElement as HTMLElement | null;
      setIsMounted(true);
      setIsClosing(false);
    } else if (isMounted) {
      setIsClosing(true);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      closeTimerRef.current = setTimeout(() => {
        setIsMounted(false);
        setIsClosing(false);
      }, CLOSE_DELAY_MS);
    }
    return () => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current); };
  }, [isOpen]);

  // Focus + body scroll lock
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
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMounted, onClose]);

  // Tab focus trap — cycle within the nav list only
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

  if (!isMounted) return null;

  const handleItemClick = (path?: string) => {
    if (path) navigateWithTransition(navigate, path);
    onClose();
  };

  return createPortal(
    <div className={`nav-menu${isClosing ? ' is-closing' : ''}`}>
      <div className="nav-menu__backdrop" onClick={onClose} aria-hidden="true" />

      <nav className="nav-menu__list" aria-label="Site navigation" ref={panelRef} tabIndex={-1}>
        {NAV_ITEMS.map((item, i) => {
          const isActive = item.path !== undefined && item.path === location.pathname;
          return (
            <button
              key={item.label}
              type="button"
              className={`nav-menu__item${isActive ? ' is-active' : ''}`}
              style={isClosing ? undefined : { animationDelay: `${i * 60}ms` }}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => handleItemClick(item.path)}
            >
              {item.heroIndex !== undefined ? (
                <>
                  {item.label.slice(0, item.heroIndex)}
                  <span className={`nav-menu__item-accent${item.heroAlt === false ? '' : ' is-alt'}`}>
                    {item.label[item.heroIndex]}
                  </span>
                  {item.label.slice(item.heroIndex + 1)}
                </>
              ) : item.label}
            </button>
          );
        })}
      </nav>
    </div>,
    document.body,
  );
}
