import './Header.css';

interface HeaderProps {
  onDesignSystemActivate: () => void;
}

export function Header({ onDesignSystemActivate }: HeaderProps) {
  return (
    <header className="header">
      <span className="header__name header__name--left">TOM</span>

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

      <span className="header__name header__name--right">WINTER</span>
    </header>
  );
}
