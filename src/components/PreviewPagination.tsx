import './PreviewPagination.css';

interface PreviewPaginationProps {
  total:      number;
  current:    number;
  onNavigate: (index: number) => void;
}

/** Dot/pill row navigating between variants of a feature-page preview.
 *  Visual language mirrors SidebarRight's mobile pagination (3×3 dot at
 *  rest, 24×3 pill when active) — same indicator, smaller context. */
export function PreviewPagination({ total, current, onNavigate }: PreviewPaginationProps) {
  return (
    <nav className="preview-pagination" aria-label="Preview variants">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          type="button"
          className={`preview-pagination__segment${i === current ? ' preview-pagination__segment--active' : ''}`}
          aria-label={`Show variant ${i + 1}${i === current ? ', current' : ''}`}
          aria-current={i === current ? 'true' : undefined}
          onClick={() => onNavigate(i)}
        />
      ))}
    </nav>
  );
}
