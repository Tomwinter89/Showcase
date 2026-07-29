import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FEATURES } from '../data/features';
import { navigateWithTransition, withViewTransition } from '../utils/navigation';
import { SheetStackingDemo } from '../components/SheetStackingDemo';
import { CategoryDock, CHARACTER_ITEMS } from '../components/CategoryDock';
import { RevealStack } from '../components/RevealStack';
import { PreviewPagination } from '../components/PreviewPagination';
import './FeaturePage.css';

// ── Feature article content ───────────────────────────────────────────────────

function SheetStackingArticle() {
  return (
    <>
      <p className="feature-page__body">
        In ecommerce, every navigation away from the cart is a chance to lose
        the sale. Abandonment is the number everyone watches — and yet
        customers still need to check what they're actually buying. Read the
        details, confirm the specs, change their mind about quantity. The
        conventional answer sends them back to the product page, which means
        leaving the cart entirely and hoping they find their way back.
      </p>
      <p className="feature-page__body">
        Sheet stacking removes that trade-off by layering instead of
        navigating. The cart stays open. Tapping a product opens its details
        in a second sheet stacked on top of the first — same context, one
        level deeper. Dismiss steps back to the cart, never out of it. Each
        sheet is aware of the one beneath it, so focus, Escape and
        click-outside all behave predictably rather than falling apart the way
        modal-on-modal usually does. Inspired by Slick HQ's web sheet patterns
        and native iOS navigation stacks.
      </p>
      <p className="feature-page__hint">
        <strong>Try it above</strong> — open the cart, adjust quantities with the steppers,
        then tap any product name or image to stack its details on top. Remove an item
        and the footer switches to <strong>Add to cart</strong>. Close with ✕ or Escape.
      </p>
    </>
  );
}

function CategoryDockArticle() {
  return (
    <>
      <p className="feature-page__body">
        {/* PLACEHOLDER — draft copy, to be rewritten */}
        Category navigation is one of the most everyday components there is:
        a static row of tiles you tap to filter. It's functional, it's
        forgettable, and nobody thinks about it twice. That's exactly why it's
        an interesting place to spend a little craft — the components users
        touch most are the ones most worth making feel alive.
      </p>
      <p className="feature-page__body">
        The idea here is to borrow the tactility of the macOS dock: tiles
        swell toward the cursor and settle back as it leaves, with the label
        surfacing only for the tile you're actually pointing at. Nothing about
        the underlying function changes — you still tap a category — but the
        row now responds to you. It's a small, low-stakes moment of delight
        layered onto something that would otherwise just sit there.
      </p>
      <p className="feature-page__hint">
        <strong>Try it above</strong> — move your cursor across the tiles and
        watch them magnify toward the pointer. The gap between tiles holds
        steady no matter how large they grow.
      </p>
    </>
  );
}

function RevealStackArticle() {
  return (
    <>
      <p className="feature-page__body">
        {/* PLACEHOLDER — draft copy, to be rewritten */}
        Queues are full of static rows — up next, playlists, watch-later
        lists — that sit there taking up vertical space whether or not
        you're looking at them right now. The usual trade-off is blunt: show
        everything and push the rest of the page down, or hide it and hope
        nobody misses it.
      </p>
      <p className="feature-page__body">
        A reveal stack collapses the queue into a single tappable pile. The
        next track shows in full so you always know what's coming, with a
        hint of what follows peeking out behind it. Tap the chevron and the
        rest fans open, each row settling into place with a small stagger.
        It reclaims the vertical space a static list would burn, and turns a
        passive queue into a moment that rewards a little curiosity.
      </p>
      <p className="feature-page__hint">
        <strong>Try it above</strong> — tap the chevron next to <strong>Up next</strong> to
        fan the queue open, and again to collapse it back into a neat stack.
      </p>
    </>
  );
}

function PlaceholderArticle({ subtitle }: { subtitle: string }) {
  return <p className="feature-page__body">{subtitle}</p>;
}

function getArticleContent(id: string, subtitle: string) {
  switch (id) {
    case 'sheet-stacking': return <SheetStackingArticle />;
    case 'category-dock':  return <CategoryDockArticle />;
    case 'reveal-stack':   return <RevealStackArticle />;
    default:               return <PlaceholderArticle subtitle={subtitle} />;
  }
}

// Each feature's demo as an ordered array of variants. A single-element array
// renders with no pagination; 2+ elements get PreviewPagination dots below the
// well, and clicking a dot crossfades to that variant in place.
function getDemoVariants(id: string): React.ReactNode[] {
  switch (id) {
    case 'sheet-stacking': return [<SheetStackingDemo />];
    case 'category-dock':  return [
      <div className="category-dock-demo"><CategoryDock variant="tile" /></div>,
      <div className="category-dock-demo"><CategoryDock variant="bar" items={CHARACTER_ITEMS} /></div>,
    ];
    case 'reveal-stack':   return [<div className="reveal-stack-demo"><RevealStack /></div>];
    default:               return [];
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function FeaturePage() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();
  const feature  = FEATURES.find(f => f.id === id);

  const [variantIndex, setVariantIndex] = useState(0);

  // A route change to a different feature should always land on its first variant.
  useEffect(() => { setVariantIndex(0); }, [id]);

  if (!feature) {
    navigateWithTransition(navigate, '/');
    return null;
  }

  const variants = getDemoVariants(feature.id);

  const handleVariantNavigate = (index: number) => {
    withViewTransition(() => setVariantIndex(index));
  };

  return (
    <main className="feature-page">
      <article className="feature-page__article">

        <header className="feature-page__header">
          <p className="feature-page__label">Interaction pattern</p>
          <h1 className="feature-page__title">{feature.title}</h1>
        </header>

        {/* Preview well sits above the copy and bleeds past the article's
            horizontal padding, so it reads wider than the body text. */}
        {variants.length > 0 && (
          <section className="feature-page__preview" aria-label="Interactive demo">
            {variants[variantIndex]}
          </section>
        )}

        {variants.length > 1 && (
          <PreviewPagination
            total={variants.length}
            current={variantIndex}
            onNavigate={handleVariantNavigate}
          />
        )}

        <div className="feature-page__body-wrap">
          {getArticleContent(feature.id, feature.subtitle)}
        </div>

      </article>
    </main>
  );
}
