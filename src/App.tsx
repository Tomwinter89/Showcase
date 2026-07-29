import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { Layout }      from './components/Layout';
import { Header }      from './components/Header';
import { SidebarLeft } from './components/SidebarLeft';
import { SidebarRight } from './components/SidebarRight';
import { Playground }  from './pages/Playground';
import { DesignSystem } from './pages/DesignSystem';
import { FeaturePage }  from './pages/FeaturePage';
import { About }        from './pages/About';
import { TOTAL_FEATURES } from './data/features';
import { navigateWithTransition } from './utils/navigation';

export default function App() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const [currentFeature, setCurrentFeature] = useState(0);

  const isPlayground   = location.pathname === '/';
  const isFeaturePage  = location.pathname.startsWith('/feature/');
  const isAbout        = location.pathname === '/about';

  const toggleDesignSystem = useCallback(() => {
    const target = location.pathname === '/design-system' ? '/' : '/design-system';
    navigateWithTransition(navigate, target);
  }, [location.pathname, navigate]);

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
      header={<Header onDesignSystemActivate={toggleDesignSystem} />}
      sidebarLeft={
        <SidebarLeft
          title={isAbout ? 'About' : isFeaturePage ? 'Back' : 'Digital playground'}
          onClick={isFeaturePage ? () => navigateWithTransition(navigate, '/') : undefined}
        />
      }
      sidebarRight={isPlayground ? (
        <SidebarRight
          total={TOTAL_FEATURES}
          current={currentFeature}
          onNavigate={setCurrentFeature}
        />
      ) : undefined}
    >
      <Routes>
        <Route path="/"              element={<Playground currentIndex={currentFeature} onNavigate={setCurrentFeature} />} />
        <Route path="/design-system" element={<DesignSystem />} />
        <Route path="/feature/:id"   element={<FeaturePage />} />
        <Route path="/about"         element={<About />} />
      </Routes>
    </Layout>
  );
}
