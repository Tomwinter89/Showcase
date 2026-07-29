import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from './Button';
import './Sheet.css';

// Module-level sheet registry — tracks mounted sheet depths.
// Ensures Escape only fires for the topmost sheet and body scroll
// lock is removed only when all sheets are closed.
const _mountedDepths = new Set<number>();
let _nextDepth = 0;

const CLOSE_DELAY_MS = 340;

interface SheetProps {
  isOpen:      boolean;
  onClose:     () => void;
  title?:      string;
  /** 'header' (default) — title bar with border-bottom, current behaviour.
   *  'floating' — no title bar; close button floats top-right over the
   *  content instead (e.g. over a hero image). `title`, if given, still
   *  supplies the dialog's accessible name via aria-label. */
  variant?:    'header' | 'floating';
  children:    React.ReactNode;
  stackState?: 'condensed' | 'expanded' | null;
  footer?:     React.ReactNode;
}

export function Sheet({ isOpen, onClose, title, variant = 'header', children, stackState = null, footer }: SheetProps) {
  const [isMounted, setIsMounted]   = useState(isOpen);
  const [isClosing, setIsClosing]   = useState(false);
  const panelRef       = useRef<HTMLDivElement>(null);
  const prevFocusRef   = useRef<HTMLElement | null>(null);
  const depthRef       = useRef(0);
  const closeTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const labelId        = useId();

  // Mount / unmount with animation delay
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

  // Focus + body scroll lock + depth registration
  useEffect(() => {
    if (!isMounted) return;

    depthRef.current = ++_nextDepth;
    _mountedDepths.add(depthRef.current);
    if (_mountedDepths.size === 1) document.body.classList.add('is-sheet-open');

    panelRef.current?.focus();

    return () => {
      _mountedDepths.delete(depthRef.current);
      if (_mountedDepths.size === 0) document.body.classList.remove('is-sheet-open');
      prevFocusRef.current?.focus();
    };
  }, [isMounted]);

  // Escape — only the topmost sheet responds
  useEffect(() => {
    if (!isMounted) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && depthRef.current === Math.max(..._mountedDepths)) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMounted, onClose]);

  // Tab focus trap — cycle within this panel only
  useEffect(() => {
    if (!isMounted || !panelRef.current) return;
    const panel = panelRef.current;
    const sel   = 'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

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

  const panelClass = [
    'sheet-panel',
    stackState === 'condensed' && 'is-condensed',
    stackState === 'expanded'  && 'is-expanded',
  ].filter(Boolean).join(' ');

  return createPortal(
    <div className={`sheet-root${isClosing ? ' is-closing' : ''}`}>
      <div className="sheet-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="sheet-wrap">
        <div
          className={panelClass}
          role="dialog"
          aria-modal="true"
          aria-labelledby={variant === 'header' && title ? labelId : undefined}
          aria-label={variant === 'floating' ? title : undefined}
          tabIndex={-1}
          ref={panelRef}
        >
          {variant === 'header' && (
            <div className="sheet-header">
              {title
                ? <h2 className="sheet-title" id={labelId}>{title}</h2>
                : <div />
              }
              <Button icon={X} variant="secondary" size="sm" aria-label="Close" onClick={onClose} />
            </div>
          )}

          {variant === 'floating' && (
            <Button
              icon={X}
              variant="scrim"
              size="sm"
              aria-label="Close"
              onClick={onClose}
              className="sheet-close-float"
            />
          )}

          <div className="sheet-content">
            {children}
          </div>
          {footer && (
            <div className="sheet-footer">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
