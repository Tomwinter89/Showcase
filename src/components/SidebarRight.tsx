import './SidebarRight.css';

interface SidebarRightProps {
  total:      number;
  current:    number;
  onNavigate: (index: number) => void;
}

export function SidebarRight({ total, current, onNavigate }: SidebarRightProps) {
  return (
    <aside className="sidebar-right" aria-label="Pagination">
      {/* Mobile: horizontal at bottom; Desktop: vertical lines on the right */}
      <nav className="sidebar-right__indicators" aria-label="Feature navigation">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            type="button"
            className={`sidebar-right__segment${i === current ? ' sidebar-right__segment--active' : ''}`}
            aria-label={`Go to feature ${i + 1}${i === current ? ', current' : ''}`}
            aria-current={i === current ? 'true' : undefined}
            onClick={() => onNavigate(i)}
          />
        ))}
      </nav>
    </aside>
  );
}
