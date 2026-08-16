import { Menu, MoveRight } from 'lucide-react';
import logo from '../assets/logo.svg';
import { Button } from './Button';
import './Header.css';

interface HeaderProps {
  onDesignSystemActivate: () => void;
  onLogoClick:            () => void;
  /** SidebarLeft owns this button on desktop (hidden there below 768px);
      the header carries its own copy for mobile, since there's no
      persistent side rail at that width for it to live in. Same handler,
      just a different position per breakpoint — not two separate menus. */
  onMenuClick:            () => void;
  /** Mobile counterpart to NextFeatureArrow (desktop, sidebarRight) — same
      reasoning as onMenuClick. undefined outside feature pages, where
      there's no "next" to go to. */
  onNextFeatureClick?:    () => void;
  /** Current feature's title, whenever one exists — stays populated even
      while showCompactTitle is false, so the crossfade below always has
      real text to animate rather than a blank span suddenly filling in. */
  featureTitle?:          string;
  /** Mobile-only: true once the feature-page <h1> has scrolled out from
      under the sticky header — swaps the logo for featureTitle in place,
      iOS-large-title style. Desktop ignores this entirely (see Header.css);
      SidebarLeft's "Back" label already covers wayfinding there. */
  showCompactTitle?:      boolean;
}

export function Header({ onDesignSystemActivate, onLogoClick, onMenuClick, onNextFeatureClick, featureTitle, showCompactTitle }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__left">
        {/* Plain wrapper for the responsive display toggle, rather than a
            class on Button itself — .btn-tertiary already sets `display`,
            and fighting that with equal-specificity CSS depends on import
            order between Header.css and Button.css, which isn't reliable. */}
        <div className="header__menu-button">
          <Button variant="tertiary" icon={Menu} aria-label="Menu" onClick={onMenuClick} />
        </div>

        {/* Logo and compact title occupy the same slot, crossfading between
            them — mirrors Reveal Stack's chevron icon swap (two elements
            stay mounted, opacity/scale/blur toggles via .is-visible/
            .is-hidden) rather than mounting/unmounting either one, which
            would skip the transition entirely. */}
        <div className="header__logo-slot">
          <a
            href="/"
            className={`header__logo-link${showCompactTitle ? ' is-hidden' : ''}`}
            onClick={(e) => { e.preventDefault(); onLogoClick(); }}
            aria-label="Tom Winter — home"
          >
            <img src={logo} alt="" className="header__logo" />
          </a>

          {/* Decorative — the page's own <h1> already carries the real,
              announced title; this is a transient scroll-driven visual echo
              of it, not independent content. */}
          <span
            className={`header__compact-title${showCompactTitle ? ' is-visible' : ''}`}
            aria-hidden="true"
          >
            {featureTitle}
          </span>
        </div>
      </div>

      {onNextFeatureClick && (
        <div className="header__next-feature-button">
          <Button variant="tertiary" icon={MoveRight} aria-label="Next project" onClick={onNextFeatureClick} />
        </div>
      )}

      {/*
        Design System easter egg: visually hidden but reachable via Tab.
        When focused it becomes visible; Enter/click toggles the DS page.
      */}
      <a
        href="#design-system"
        className="header__ds-link"
        onClick={(e) => { e.preventDefault(); onDesignSystemActivate(); }}
        aria-label="Open design system"
      >
        Design System
      </a>
    </header>
  );
}
