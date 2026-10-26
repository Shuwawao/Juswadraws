import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: '2.5px solid var(--text-primary)',
        backgroundColor: 'var(--bg-secondary)',
        position: 'relative',
        marginTop: '6rem',
        overflow: 'hidden'
      }}
    >
      {/* Anime Warning Hazard Line */}
      <div className="hazard-strip" />

      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '3.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3rem',
            marginBottom: '3.5rem'
          }}
        >
          {/* Identity Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className="font-heading" style={{ fontSize: '2rem', letterSpacing: '0.06em' }}>
                JUSWA<span style={{ color: 'var(--accent-red)' }}>DRAWS</span>
              </span>
              <span className="manga-narrator-box manga-narrator-box-red">OFFICIAL</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '360px' }}>
              Digital artist, character illustrator & professional doodler based in the Philippines. Exploring characters, expressive lines, and anime storytelling.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.5rem' }}>
              <div className="speech-bubble">
                <span>✦ OPEN FOR COMMISSIONS</span>
              </div>
            </div>
          </div>

          {/* Social Links Column (Verified Real URLs) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div className="section-subtitle">CONNECT & SOCIALS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <a
                href="https://www.instagram.com/juswa_draws"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                <Instagram size={18} color="var(--accent-purple)" />
                <span>@juswa_draws (Art Account)</span>
                <ArrowUpRight size={14} color="var(--text-muted)" />
              </a>

              <a
                href="https://www.instagram.com/shuwawao"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                <Instagram size={18} color="var(--accent-cyan)" />
                <span>@shuwawao (Personal Account)</span>
                <ArrowUpRight size={14} color="var(--text-muted)" />
              </a>

              <a
                href="https://www.facebook.com/share/1F1aA2ChW4/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                <Facebook size={18} color="#3b82f6" />
                <span>Facebook Profile</span>
                <ArrowUpRight size={14} color="var(--text-muted)" />
              </a>

              <a
                href="mailto:joshualagare255@gmail.com"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                <Mail size={18} color="var(--accent-yellow)" />
                <span>joshualagare255@gmail.com</span>
                <ArrowUpRight size={14} color="var(--text-muted)" />
              </a>
            </div>
          </div>

          {/* Quick Directory & Admin Portal */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div className="section-subtitle">EXPLORE PORTFOLIO</div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem'
              }}
            >
              <Link to="/artworks" style={{ color: 'var(--text-secondary)' }}>
                → All Artworks
              </Link>
              <Link to="/about" style={{ color: 'var(--text-secondary)' }}>
                → Artist Bio
              </Link>
              <Link to="/commissions" style={{ color: 'var(--text-secondary)' }}>
                → Pricing & Policy
              </Link>
              <Link to="/sketch-wall" style={{ color: 'var(--text-secondary)' }}>
                → Doodle Wall
              </Link>
              <Link to="/contact" style={{ color: 'var(--text-secondary)' }}>
                → Send Inquiry
              </Link>
              <Link
                to="/admin"
                style={{
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <ShieldCheck size={14} color="var(--accent-purple)" />
                <span>Artist Admin</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.8rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)'
          }}
        >
          <div>
            © {currentYear} JUSWADRAWS. All digital artworks & character designs created by Joshua Lagare.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>BUILT WITH INK, CODE & PASSION</span>
            <span style={{ color: 'var(--accent-red)' }}>•</span>
            <span className="tape-tag" style={{ fontSize: '0.65rem' }}>V2.0 LIVE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
