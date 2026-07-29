import type { ReactNode } from 'react';
import './FeaturePreview.css';

interface FeaturePreviewProps {
  title:      string;
  subtitle:   string;
  featureId:  string;
  onNavigate: () => void;
  /** Optional decorative cover that fills the card and replaces the raised surface. */
  cover?:     ReactNode;
}

export function FeaturePreview({ title, subtitle, featureId, onNavigate, cover }: FeaturePreviewProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate();
  };

  return (
    <article className="feature" aria-label={title}>
      {/*
        <a href> makes this a real navigation link — right-click → open in new tab
        works, screen readers announce it as a link to a page, not an action button.
        With a cover the cover IS the surface, so the raised-surface chrome is dropped.
      */}
      <a
        href={`/feature/${featureId}`}
        className={`feature__card${cover ? ' feature__card--cover' : ' raised-surface'}`}
        aria-label={`View ${title}`}
        onClick={handleClick}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onNavigate(); } }}
      >
        {cover}
      </a>
      <div className="feature__caption">
        <h2 className="feature__title">{title}</h2>
        <p className="feature__subtitle">{subtitle}</p>
      </div>
    </article>
  );
}
