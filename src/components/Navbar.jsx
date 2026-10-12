import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, Sparkles, Paintbrush, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { theme, toggleTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { num: '01', label: 'WORKS', to: '/artworks' },
    { num: '02', label: 'ABOUT', to: '/about' },
    { num: '03', label: 'PRICING', to: '/commissions' },
    { num: '04', label: 'SKETCH WALL', to: '/sketch-wall', badge: 'NEW' },
    { num: '05', label: 'CONTACT', to: '/contact' }
  ];

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: scrolled ? 'var(--bg-primary)' : 'transparent',
          borderBottom: scrolled ? '1px solid var(--border-color)' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
          width: '100%'
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.85rem',
            paddingBottom: '0.85rem'
          }}
        >
          {/* Brand Logo with Custom juswa-font asset */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none'
            }}
            aria-label="JUSWADRAWS Home"
          >
            <img
              src={isDark ? '/favicon-dark.png' : '/favicon-light.png'}
              alt="JUSWADRAWS Icon"
              style={{
                width: '38px',
                height: '38px',
                objectFit: 'contain',
                flexShrink: 0,
                display: 'block'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span
                  className="font-heading"
                  style={{
                    fontSize: '1.65rem',
                    letterSpacing: '0.08em',
                    lineHeight: 1,
                    color: 'var(--text-primary)'
                  }}
                >
                  JUSWA<span style={{ color: 'var(--accent-purple)' }}>DRAWS</span>
                </span>
                <span className="tape-tag" style={{ fontSize: '0.62rem', padding: '0.1rem 0.35rem' }}>
                  STUDIO
                </span>
              </div>
              <span
                className="font-mono"
                style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.12em',
                  color: 'var(--text-muted)'
                }}
              >
                CHARACTER ARTIST // PH
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '1.8rem'
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  borderBottom: isActive ? '2px solid var(--accent-purple)' : '2px solid transparent',
                  paddingBottom: '0.2rem',
                  transition: 'color 0.2s ease, border-color 0.2s ease'
                })}
              >
                <span style={{ color: 'var(--accent-purple)', fontSize: '0.72rem' }}>{link.num}</span>
                <span>{link.label}</span>
                {link.badge && (
                  <span
                    className="tape-tag tape-tag-red"
                    style={{ fontSize: '0.58rem', padding: '0.1rem 0.3rem', marginLeft: '0.2rem' }}
                  >
                    {link.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Actions: Theme Toggle & Mobile Menu Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                boxShadow: '2px 2px 0px var(--border-bold)',
                transition: 'all 0.15s ease'
              }}
              className="theme-toggle-btn"
            >
              {isDark ? <Sun size={18} color="var(--accent-yellow)" /> : <Moon size={18} color="var(--accent-purple)" />}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                border: '2px solid var(--text-primary)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                boxShadow: '3px 3px 0px var(--text-primary)'
              }}
              className="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            top: '65px',
            zIndex: 999,
            backgroundColor: 'var(--bg-primary)',
            borderTop: '2px solid var(--border-bold)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '2rem 1.5rem',
            overflowY: 'auto'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="section-subtitle">NAVIGATION DIRECTORY</div>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  border: '1px solid var(--border-color)',
                  backgroundColor: isActive ? 'var(--bg-secondary)' : 'var(--bg-card)',
                  boxShadow: isActive ? '4px 4px 0px var(--accent-purple)' : '2px 2px 0px var(--border-bold)',
                  textDecoration: 'none'
                })}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className="font-mono" style={{ color: 'var(--accent-purple)', fontWeight: 700 }}>
                    {link.num}
                  </span>
                  <span className="font-heading" style={{ fontSize: '1.6rem', color: 'var(--text-primary)' }}>
                    {link.label}
                  </span>
                </div>
                {link.badge ? (
                  <span className="tape-tag tape-tag-red">{link.badge}</span>
                ) : (
                  <ArrowUpRight size={20} color="var(--text-muted)" />
                )}
              </NavLink>
            ))}
          </div>

          <div
            style={{
              paddingTop: '2rem',
              borderTop: '1px dashed var(--border-bold)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                THEME SETTING:
              </span>
              <button
                onClick={toggleTheme}
                className="btn-manga-secondary"
                style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
              >
                {isDark ? 'SWITCH TO LIGHT' : 'SWITCH TO DARK'}
              </button>
            </div>
            <Link
              to="/commissions"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-manga"
              style={{ width: '100%' }}
            >
              <Paintbrush size={18} /> COMMISSION JUSWA
            </Link>
          </div>
        </div>
      )}

      {/* Responsive CSS for Desktop Nav */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
