import { MoveRight } from 'lucide-react';
import { Button } from './Button';
import './NextFeatureArrow.css';

interface NextFeatureArrowProps {
  onClick: () => void;
}

// Feature-page-only counterpart to SidebarLeft's menu icon — same column
// width and sticky/centring treatment (see NextFeatureArrow.css), mirrored
// to the right edge, so the two stay vertically aligned with each other.
export function NextFeatureArrow({ onClick }: NextFeatureArrowProps) {
  return (
    <aside className="next-feature-arrow" aria-label="Next project">
      <Button variant="tertiary" icon={MoveRight} aria-label="Next project" onClick={onClick} />
    </aside>
  );
}
