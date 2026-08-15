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
}

export function Header({ onDesignSystemActivate, onLogoClick, onMenuClick, onNextFeatureClick }: HeaderProps) {
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

        <a
          href="/"
          className="header__logo-link"
          onClick={(e) => { e.preventDefault(); onLogoClick(); }}
          aria-label="Tom Winter — home"
        >
          <img src={logo} alt="" className="header__logo" />
        </a>
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
