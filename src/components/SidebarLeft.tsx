import { Menu } from 'lucide-react';
import { Button } from './Button';
import './SidebarLeft.css';

interface SidebarLeftProps {
  /** Feature pages wire this to "go back"; elsewhere it's inert until the
      real navigation menu it'll eventually open is built. */
  onClick?: () => void;
}

export function SidebarLeft({ onClick }: SidebarLeftProps) {
  return (
    <aside className="sidebar-left" aria-label="Section">
      <Button variant="tertiary" icon={Menu} aria-label="Menu" onClick={onClick} />
    </aside>
  );
}
