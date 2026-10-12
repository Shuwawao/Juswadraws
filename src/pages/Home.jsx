import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Paintbrush, Flame, Layers, ExternalLink, ChevronDown, Eye, Volume2 } from 'lucide-react';
import { ARTWORKS } from '../data/artworksManifest';
import SoftwareTools from '../components/SoftwareTools';
import ImageViewerModal from '../components/ImageViewerModal';
import soundFx from '../utils/soundFx';

export default function Home() {
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  // Curate 6 high-impact featured works for the home gallery showcase
  const featuredWorks = ARTWORKS.filter(
    (a) => a.isFeatured && a.categoryId !== 'my-photo'
  ).slice(0, 6);

  const openViewer = (art) => {
    setSelectedArtwork(art);
  };

  const handlePrev = () => {
    const idx = featuredWorks.findIndex((a) => a.id === selectedArtwork.id);
    if (idx > 0) setSelectedArtwork(featuredWorks[idx - 1]);
  };

  const handleNext = () => {
    const idx = featuredWorks.findIndex((a) => a.id === selectedArtwork.id);
    if (idx < featuredWorks.length - 1) setSelectedArtwork(featuredWorks[idx + 1]);
  };
  // Dynamic scroll listener for interactive parallax shift
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* ========================================================
          HERO SECTION — Gritty Anime Layering & Editorial Spine
          ======================================================== */}
      <section
        style={{
          minHeight: 'calc(100vh - 75px)',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          padding: 'clamp(2.5rem, 6vw, 5rem) 0',
          borderBottom: '2px solid var(--border-bold)'
        }}
      >
        {/* ========================================================
            GACHIAKUTA ANIMATED MARQUEE BACKGROUND STREAM
            Multiple animated rows moving from right to left with Dela Gothic One
            ======================================================== */}
        <div className="gachiakuta-marquee-container" aria-hidden="true">
          {/* Row 1: Right-to-Left Ticker */}
          <div
            className="gachiakuta-marquee-row marquee-scroll-left"
            style={{ transform: `translateX(${-scrollY * 0.25}px)` }}
          >
            {[...Array(6)].map((_, i) => (
              <React.Fragment key={`r1-${i}`}>
                <span className="marquee-text-outline">JUSWA DRAWS</span>
                <span className="marquee-text-solid">JUSWA DRAWS</span>
              </React.Fragment>
            ))}
          </div>

          {/* Row 2: Right-to-Left Ticker (Faster Offset) */}
          <div
            className="gachiakuta-marquee-row marquee-scroll-left-fast"
            style={{ transform: `translateX(${-scrollY * 0.45}px)` }}
          >
            {[...Array(6)].map((_, i) => (
              <React.Fragment key={`r2-${i}`}>
                <span className="marquee-text-solid">JUSWA DRAWS</span>
                <span className="marquee-text-outline">JUSWA DRAWS</span>
              </React.Fragment>
            ))}
          </div>

          {/* Row 3: Right-to-Left Ticker (Slower Atmospheric) */}
          <div
            className="gachiakuta-marquee-row marquee-scroll-left-slow"
            style={{ transform: `translateX(${-scrollY * 0.18}px)` }}
          >
            {[...Array(6)].map((_, i) => (
              <React.Fragment key={`r3-${i}`}>
                <span className="marquee-text-outline">JUSWA DRAWS</span>
                <span className="marquee-text-solid">JUSWA DRAWS</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'clamp(2rem, 5vw, 4rem)',
              alignItems: 'center'
            }}
          >
            {/* Left Content Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
              {/* Category / Subtitle Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span className="tape-tag" style={{ background: 'var(--accent-yellow-tape)', color: '#000' }}>
                  DIGITAL ART ARCHIVE
                </span>
                <span className="tape-tag tape-tag-purple">ORIGINAL & COMMISSIONS</span>
              </div>

              {/* Hand-drawn Brand Asset + Oversized Typography */}
              <div>
                <div style={{ marginBottom: '0.5rem', maxWidth: '320px' }}>
                  <img
                    src="/artworks/my%20photo/juswa-font.png"
                    alt="JUSWADRAWS Signature Wordmark"
                    style={{
                      height: 'auto',
                      maxHeight: '65px',
                      objectFit: 'contain',
                      filter: 'drop-shadow(2px 2px 0px var(--accent-purple))'
                    }}
                  />
                </div>
                <h1
                  className="font-heading"
                  style={{
                    fontSize: 'clamp(3.5rem, 8.5vw, 6.5rem)',
                    lineHeight: 0.9,
                    letterSpacing: '0.02em',
                    color: 'var(--text-primary)',
                    textTransform: 'uppercase'
                  }}
                >
                  DIGITAL ARTIST.<br />
                  <span style={{ color: 'var(--accent-purple)' }}>CHARACTER</span> ILLUSTRATOR.<br />
                  <span className="font-hand" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: 'var(--accent-yellow)', textTransform: 'none' }}>
                    professional doodler.
                  </span>
                </h1>
              </div>

              {/* Artist Statement */}
              <p
                style={{
                  fontSize: 'clamp(1rem, 1.2vw, 1.15rem)',
                  color: 'var(--text-secondary)',
                  maxWidth: '540px',
                  lineHeight: 1.6,
                  borderLeft: '3px solid var(--accent-purple)',
                  paddingLeft: '1rem'
                }}
              >
                &ldquo;Exploring characters, intense expressions, dynamic lines, and gritty anime stories through digital illustration.&rdquo;
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
                <Link
                  to="/artworks"
                  className="btn-manga glitch-hover"
                  onClick={() => soundFx.playClick()}
                  onMouseEnter={() => soundFx.playHover()}
                >
                  <Eye size={18} /> EXPLORE ARTWORKS
                </Link>
                <Link
                  to="/commissions"
                  className="btn-manga btn-manga-secondary glitch-hover"
                  onClick={() => soundFx.playSlash()}
                  onMouseEnter={() => soundFx.playHover()}
                >
                  <Paintbrush size={18} /> COMMISSION ME
                </Link>
              </div>

              {/* Metadata Micro-Ribbon */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  marginTop: '1rem',
                  borderTop: '1px dashed var(--border-color)',
                  paddingTop: '1rem'
                }}
              >
                <div>STATUS: <strong style={{ color: '#22c55e' }}>ONLINE // OPEN</strong></div>
                <div>MEDIUM: <strong style={{ color: 'var(--text-primary)' }}>CLIP STUDIO / KRITA</strong></div>
                <div>LOCATION: <strong style={{ color: 'var(--text-primary)' }}>PHILIPPINES</strong></div>
              </div>
            </div>

            {/* Right Art Composition (Using Real Drawing: juswa-zoom-2.png) */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <div
                className="manga-panel cut-corner"
                style={{
                  width: '100%',
                  maxWidth: '500px',
                  aspectRatio: '1 / 1.15',
                  overflow: 'hidden',
                  border: '2px solid var(--text-primary)',
                  boxShadow: '10px 10px 0px var(--accent-purple)',
                  position: 'relative'
                }}
              >
                <img
                  src="/artworks/my%20photo/juswa-zoom-2.png"
                  alt="Juswa Digital Persona Portrait"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                />

                {/* Stencil Tag in corner */}
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    zIndex: 2
                  }}
                >
                  <span className="tape-tag" style={{ background: '#000', color: '#fff' }}>
                    SELF-PORTRAIT // 01
                  </span>
                </div>

                <div
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    padding: '1.2rem',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    color: '#fff'
                  }}
                >
                  <div>
                    <div className="font-heading" style={{ fontSize: '1.4rem', letterSpacing: '0.04em' }}>
                      JUSWA PERSONA
                    </div>
                    <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-yellow)' }}>
                      DIGITAL INK ON CANVAS
                    </div>
                  </div>
                  <span className="font-mono" style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                    EST. 2026
                  </span>
                </div>
              </div>

              {/* Offset Decorative Graphic Tag */}
              <div
                className="tape-tag tape-tag-red"
                style={{
                  position: 'absolute',
                  bottom: '-12px',
                  right: '10px',
                  zIndex: 3,
                  fontSize: '0.85rem',
                  padding: '0.4rem 1rem'
                }}
              >
                GACHIAKUTA & MHA INSPIRED
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          FEATURED ARTWORKS GALLERY PREVIEW
          ======================================================== */}
      <section style={{ padding: '6rem 0', position: 'relative' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '1.5rem',
              marginBottom: '3rem'
            }}
          >
            <div>
              <div className="section-subtitle">CURATED SELECTION</div>
              <h2 className="section-title">FEATURED ARTWORKS</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', maxWidth: '520px' }}>
                Hand-picked original illustrations, character designs, and client commissions directly from the vault.
              </p>
            </div>
            <Link to="/artworks" className="btn-manga btn-manga-secondary">
              VIEW ALL 64 PIECES <ArrowRight size={18} />
            </Link>
          </div>

          {/* Asymmetric Editorial Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}
          >
            {featuredWorks.map((art, idx) => (
              <div
                key={art.id}
                className="manga-panel glitch-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  soundFx.playClick();
                  openViewer(art);
                }}
                onMouseEnter={() => soundFx.playHover()}
              >
                {/* Artwork Thumbnail Container */}
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: idx % 2 === 0 ? '4 / 5' : '1 / 1',
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-tertiary)'
                  }}
                >
                  <img
                    src={art.url}
                    alt={art.title}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.04)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />

                  {/* Corner Badge */}
                  <div style={{ position: 'absolute', top: '0.8rem', left: '0.8rem' }}>
                    <span className="tape-tag" style={{ fontSize: '0.65rem' }}>
                      {art.badge}
                    </span>
                  </div>
                </div>

                {/* Card Metadata */}
                <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--accent-purple)', fontWeight: 700 }}>
                      0{idx + 1} // {art.categoryName}
                    </span>
                    <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      EXP
                    </span>
                  </div>

                  <h3 className="font-heading" style={{ fontSize: '1.45rem', letterSpacing: '0.04em', color: 'var(--text-primary)' }}>
                    {art.title}
                  </h3>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginTop: '0.4rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)'
                    }}
                  >
                    <span>CLICK TO ENLARGE</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          ARTIST INTRO SECTION (Using Real Drawing: juswa pogi.jpg)
          ======================================================== */}
      <section
        style={{
          padding: '6rem 0',
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '2px solid var(--border-bold)',
          borderBottom: '2px solid var(--border-bold)',
          position: 'relative'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '4rem',
              alignItems: 'center'
            }}
          >
            {/* Visual Portrait */}
            <div style={{ position: 'relative' }}>
              <div
                className="manga-panel"
                style={{
                  width: '100%',
                  maxWidth: '440px',
                  aspectRatio: '1 / 1',
                  margin: '0 auto',
                  border: '3px solid var(--text-primary)',
                  boxShadow: '10px 10px 0px var(--accent-yellow)',
                  overflow: 'hidden'
                }}
              >
                <img
                  src="/artworks/my%20photo/juswa pogi.jpg"
                  alt="Joshua Lagare (JUSWADRAWS Self Portrait)"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div
                className="tape-tag"
                style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '10%',
                  background: 'var(--bg-tape)',
                  color: 'var(--text-tape)',
                  fontSize: '0.8rem'
                }}
              >
                THE ARTIST BEHIND THE BRUSH
              </div>
            </div>

            {/* Content Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
              <div className="section-subtitle">ARTIST SPOTLIGHT</div>
              <h2 className="section-title">MEET JUSWADRAWS</h2>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7' }}>
                Hey, I’m <strong>Joshua</strong>—better known online as <strong>JUSWADRAWS</strong>. I’m an independent digital illustrator from the Philippines with a lifelong passion for high-energy character design, action illustration, and expressive storytelling.
              </p>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                My creative style is fueled by the raw, ink-heavy impact of modern anime like <em>Gachiakuta</em>, the kinetic heroic energy of <em>My Hero Academia</em>, and experimental urban street art. Whether I’m designing original character sheets (OCs) or bringing client concepts to life, every piece is drawn with intention, rhythm, and grit.
              </p>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <Link to="/about" className="btn-manga">
                  READ ARTIST BIO <ArrowRight size={18} />
                </Link>
                <Link to="/sketch-wall" className="btn-manga btn-manga-secondary">
                  VISIT DOODLE WALL
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SOFTWARE I USE SECTION (Animated Tools)
          ======================================================== */}
      <SoftwareTools />

      {/* ========================================================
          INTERACTIVE SKETCHPAD CALLOUT BANNER
          ======================================================== */}
      <section
        style={{
          padding: '5rem 0',
          position: 'relative',
          backgroundColor: 'var(--bg-tertiary)',
          borderTop: '2px solid var(--border-bold)',
          borderBottom: '2px solid var(--border-bold)'
        }}
      >
        <div className="container">
          <div
            className="manga-panel cut-corner-both"
            style={{
              padding: 'clamp(2rem, 5vw, 4rem)',
              backgroundColor: 'var(--bg-card)',
              border: '2px solid var(--text-primary)',
              boxShadow: '8px 8px 0px var(--accent-purple)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="tape-tag tape-tag-red">INTERACTIVE WALL</span>
                <span className="tape-tag">COMMUNITY CANVAS</span>
              </div>
              <h2 className="font-heading" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', lineHeight: 0.95, color: 'var(--text-primary)' }}>
                LEAVE A NOTE / DOODLE TO THE ARTIST
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', fontSize: '1rem', lineHeight: '1.6' }}>
                Pick up a digital brush, sketch a character, sign your tag, or drop a handwritten note directly onto the community canvas. Approved doodles appear forever on the public artist wall!
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
              <div className="font-mono" style={{ fontSize: '0.82rem', color: 'var(--accent-yellow)' }}>
                ✦ INCLUDES BRUSH SIZES, MULTI-COLOR INKS, ERASER & PNG EXPORT
              </div>
              <Link to="/sketch-wall" className="btn-manga" style={{ fontSize: '1.25rem', padding: '1rem 2.2rem' }}>
                <Paintbrush size={22} /> OPEN SKETCHPAD NOW
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Fullscreen Modal Image Viewer */}
      {selectedArtwork && (() => {
        const featIdx = featuredWorks.findIndex((a) => a.id === selectedArtwork.id);
        return (
          <ImageViewerModal
            artwork={selectedArtwork}
            onClose={() => setSelectedArtwork(null)}
            onPrev={handlePrev}
            onNext={handleNext}
            hasPrev={featIdx > 0}
            hasNext={featIdx < featuredWorks.length - 1}
            prevArtwork={featIdx > 0 ? featuredWorks[featIdx - 1] : null}
            nextArtwork={featIdx < featuredWorks.length - 1 ? featuredWorks[featIdx + 1] : null}
          />
        );
      })()}
    </div>
  );
}
