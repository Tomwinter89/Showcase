import './SidebarLeft.css';

interface SidebarLeftProps {
  title:    string;
  onClick?: () => void;
}

export function SidebarLeft({ title, onClick }: SidebarLeftProps) {
  return (
    <aside className="sidebar-left" aria-label="Section">
      {onClick ? (
        <button className="sidebar-left__title sidebar-left__title--link" onClick={onClick}>
          {title}
        </button>
      ) : (
        <span className="sidebar-left__title">{title}</span>
      )}
    </aside>
  );
}
