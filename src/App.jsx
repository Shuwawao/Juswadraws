import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingCommissionButton from './components/FloatingCommissionButton';

// Pages
import Home from './pages/Home';
import Artworks from './pages/Artworks';
import About from './pages/About';
import Commissions from './pages/Commissions';
import Contact from './pages/Contact';
import SketchWall from './pages/SketchWall';
import Admin from './pages/Admin';

// Scroll to top helper on route navigation
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

export default function App() {
  const { pathname } = useLocation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ScrollToTop />
      <Navbar />

      <main style={{ flex: 1 }}>
        <div key={pathname} className="page-enter-anim">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/artworks" element={<Artworks />} />
            <Route path="/about" element={<About />} />
            <Route path="/commissions" element={<Commissions />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/sketch-wall" element={<SketchWall />} />
            <Route path="/admin" element={<Admin />} />
            {/* Catch-all redirect to Home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </main>

      <FloatingCommissionButton />
      <Footer />
    </div>
  );
}
