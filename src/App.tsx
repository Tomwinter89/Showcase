import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { Layout }      from './components/Layout';
import { Header }      from './components/Header';
import { SidebarLeft } from './components/SidebarLeft';
import { SidebarRight } from './components/SidebarRight';
import { NextFeatureArrow } from './components/NextFeatureArrow';
import { NavMenu }      from './components/NavMenu';
import { Playground }  from './pages/Playground';
import { DesignSystem } from './pages/DesignSystem';
import { FeaturePage }  from './pages/FeaturePage';
import { About }        from './pages/About';
import { FEATURES, TOTAL_FEATURES } from './data/features';
import { navigateWithTransition } from './utils/navigation';

export default function App() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const [currentFeature, setCurrentFeature] = useState(0);
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  // Whether the current feature page's <h1> is currently visible — reported
  // up by FeaturePage via IntersectionObserver, consumed by Header to swap
  // in a compact title once it scrolls under the sticky header (mobile
  // only, see Header.css). Defaults true so a page always starts with the
  // logo showing rather than assuming scrolled-past on first paint.
  const [titleVisible, setTitleVisible] = useState(true);

  const isPlayground   = location.pathname === '/';
  const isFeaturePage  = location.pathname.startsWith('/feature/');

  // Feature pages get a "next project" arrow that cycles through FEATURES,
  // wrapping back to the first after the last.
  const currentFeatureId  = isFeaturePage ? location.pathname.slice('/feature/'.length) : null;
  const currentFeatureIdx = currentFeatureId ? FEATURES.findIndex((f) => f.id === currentFeatureId) : -1;
  const currentFeatureObj = currentFeatureIdx !== -1 ? FEATURES[currentFeatureIdx] : null;
  const nextFeature       = currentFeatureIdx !== -1 ? FEATURES[(currentFeatureIdx + 1) % FEATURES.length] : null;

  const toggleDesignSystem = useCallback(() => {
    const target = location.pathname === '/design-system' ? '/' : '/design-system';
    navigateWithTransition(navigate, target);
  }, [location.pathname, navigate]);

  // Shared by SidebarLeft (desktop) and Header's mobile copy of the same
  // button — opens the nav menu everywhere, feature pages included (they
  // used to go straight back instead, but the nav menu now covers that).
  const handleMenuClick = () => setNavMenuOpen((v) => !v);

  // Shared by the desktop NextFeatureArrow (sidebarRight) and Header's
  // mobile copy of the same control.
  const handleNextFeature = nextFeature
    ? () => navigateWithTransition(navigate, `/feature/${nextFeature.id}`)
    : undefined;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'd') {
        e.preventDefault();
        toggleDesignSystem();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [toggleDesignSystem]);

  return (
    <Layout
      header={
        <Header
          onDesignSystemActivate={toggleDesignSystem}
          onLogoClick={() => navigateWithTransition(navigate, '/')}
          onMenuClick={handleMenuClick}
          onNextFeatureClick={handleNextFeature}
          featureTitle={currentFeatureObj?.title}
          showCompactTitle={isFeaturePage && !titleVisible}
        />
      }
      sidebarLeft={<SidebarLeft onClick={handleMenuClick} />}
      sidebarRight={
        isPlayground ? (
          <SidebarRight
            total={TOTAL_FEATURES}
            current={currentFeature}
            onNavigate={setCurrentFeature}
          />
        ) : handleNextFeature ? (
          <NextFeatureArrow onClick={handleNextFeature} />
        ) : undefined
      }
    >
      <Routes>
        <Route path="/"              element={<Playground currentIndex={currentFeature} onNavigate={setCurrentFeature} />} />
        <Route path="/design-system" element={<DesignSystem />} />
        <Route path="/feature/:id"   element={<FeaturePage onTitleVisibilityChange={setTitleVisible} />} />
        <Route path="/about"         element={<About />} />
      </Routes>

      <NavMenu isOpen={navMenuOpen} onClose={() => setNavMenuOpen(false)} />
    </Layout>
  );
}
