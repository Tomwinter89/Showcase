import './Layout.css';
import type { ReactNode } from 'react';

interface LayoutProps {
  header: ReactNode;
  sidebarLeft: ReactNode;
  sidebarRight?: ReactNode;
  children: ReactNode;
}

export function Layout({ header, sidebarLeft, sidebarRight, children }: LayoutProps) {
  return (
    <div className="layout">
      {header}

      {/* Fixed gradient overlay — fades content just below the header on all pages */}
      <div className="layout__top-fade" aria-hidden="true" />

      {/* Three-column body on desktop; single column on mobile */}
      <main className="layout__body">
        {sidebarLeft}
        <div className="layout__centre">{children}</div>
        {sidebarRight}
      </main>
    </div>
  );
}
