import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, Sparkles, Paintbrush, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import soundFx from '../utils/soundFx';

export default function Navbar() {
  const { theme, toggleTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const handleNavClick = () => {
    soundFx.playClick();
  };

  const handleNavHover = () => {
    soundFx.playHover();
  };

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
    { num: 'CH.01', label: 'WORKS', to: '/artworks' },
    { num: 'CH.02', label: 'ABOUT', to: '/about' },
    { num: 'CH.03', label: 'PRICING', to: '/commissions' },
    { num: 'CH.04', label: 'SKETCH WALL', to: '/sketch-wall', badge: 'NEW' },
    { num: 'CH.05', label: 'CONTACT', to: '/contact' }
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
          {/* Brand Banner — JUSWA OPEN FOR COMMISSIONS */}
          <Link
            to="/"
            onClick={() => soundFx.playSlash()}
            onMouseEnter={handleNavHover}
            className="nav-brand-banner-link"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none'
            }}
            aria-label="JUSWA — Open for Commissions"
          >
            <div
              className="nav-brand-container"
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#161416',
                border: '2px solid var(--border-bold)',
                borderRadius: '4px',
                boxShadow: '3px 3px 0px var(--border-bold)',
                overflow: 'hidden',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <img
                src="/images/nav-banner.png"
                alt="JUSWA — OPEN FOR COMMISSIONS"
                className="nav-brand-banner-img"
                style={{
                  height: '42px',
                  width: 'auto',
                  display: 'block',
                  objectFit: 'contain'
                }}
              />
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
                onClick={handleNavClick}
                onMouseEnter={handleNavHover}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  borderBottom: isActive ? '2.5px solid var(--accent-red)' : '2.5px solid transparent',
                  paddingBottom: '0.25rem',
                  transition: 'color 0.2s ease, border-color 0.2s ease'
                })}
              >
                <span style={{ color: 'var(--accent-red)', fontSize: '0.72rem', fontWeight: 700 }}>{link.num}</span>
                <span>{link.label}</span>
                {link.badge && (
                  <span
                    className="tape-tag tape-tag-red"
                    style={{ fontSize: '0.58rem', padding: '0.1rem 0.35rem', marginLeft: '0.2rem' }}
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
              onClick={() => {
                toggleTheme();
                soundFx.playPop();
              }}
              onMouseEnter={handleNavHover}
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
              {isDark ? <Sun size={18} color="var(--accent-yellow)" /> : <Moon size={18} color="var(--text-primary)" />}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                soundFx.playWhoosh();
              }}
              onMouseEnter={handleNavHover}
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
          className="mobile-drawer-anim"
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: '0.5rem' }}>
              <img
                src="/images/nav-banner.png"
                alt="JUSWA — OPEN FOR COMMISSIONS"
                style={{
                  height: '46px',
                  width: 'auto',
                  borderRadius: '4px',
                  border: '2px solid var(--border-bold)',
                  boxShadow: '4px 4px 0px var(--border-bold)'
                }}
              />
            </div>
            <div className="section-subtitle">NAVIGATION DIRECTORY</div>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => {
                  handleNavClick();
                  setMobileMenuOpen(false);
                }}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  border: '1px solid var(--border-color)',
                  backgroundColor: isActive ? 'var(--bg-secondary)' : 'var(--bg-card)',
                  boxShadow: isActive ? '4px 4px 0px var(--accent-red)' : '2px 2px 0px var(--border-bold)',
                  textDecoration: 'none'
                })}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className="font-mono" style={{ color: 'var(--accent-red)', fontWeight: 700 }}>
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
                onClick={() => {
                  toggleTheme();
                  soundFx.playPop();
                }}
                className="btn-manga-secondary"
                style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
              >
                {isDark ? 'SWITCH TO LIGHT' : 'SWITCH TO DARK'}
              </button>
            </div>
            <Link
              to="/commissions"
              onClick={() => {
                soundFx.playSlash();
                setMobileMenuOpen(false);
              }}
              className="btn-manga"
              style={{ width: '100%' }}
            >
              <Paintbrush size={18} /> COMMISSION JUSWA
            </Link>
          </div>
        </div>
      )}

      {/* Responsive CSS for Desktop Nav and Brand Banner */}
      <style>{`
        .nav-brand-banner-link:hover .nav-brand-container {
          transform: translate(-2px, -2px);
          box-shadow: 5px 5px 0px var(--accent-yellow-tape) !important;
          border-color: var(--accent-yellow-tape) !important;
        }
        .nav-brand-banner-link:active .nav-brand-container {
          transform: translate(1px, 1px);
          box-shadow: 1px 1px 0px var(--accent-yellow-tape) !important;
        }
        @media (max-width: 600px) {
          .nav-brand-banner-img {
            height: 34px !important;
          }
        }
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
