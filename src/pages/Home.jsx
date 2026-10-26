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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Comic Speech Bubble Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div className="speech-bubble">
                  <span>✦ COMMISSIONS OPEN</span>
                </div>
                <span className="tape-tag tape-tag-red">
                  ORIGINAL & COMMISSIONS
                </span>
              </div>

              {/* Manga Title Typography */}
              <div>
                <h1
                  className="font-heading"
                  style={{
                    fontSize: 'clamp(3.4rem, 8vw, 6.2rem)',
                    lineHeight: 0.92,
                    letterSpacing: '0.02em',
                    color: 'var(--text-primary)',
                    textTransform: 'uppercase'
                  }}
                >
                  DIGITAL ARTIST.<br />
                  <span style={{ color: 'var(--accent-red)' }}>MANGA</span> ILLUSTRATOR.
                </h1>
              </div>

              {/* Artist Statement in Narrator Box Frame */}
              <div
                style={{
                  borderLeft: '3.5px solid var(--accent-red)',
                  paddingLeft: '1.1rem',
                  backgroundColor: 'var(--screentone-color)',
                  paddingTop: '0.4rem',
                  paddingBottom: '0.4rem'
                }}
              >
                <p
                  style={{
                    fontSize: 'clamp(0.95rem, 1.15vw, 1.1rem)',
                    color: 'var(--text-secondary)',
                    maxWidth: '540px',
                    lineHeight: 1.6
                  }}
                >
                  &ldquo;Exploring dynamic characters, intense expressions, gritty ink linework, and manga-inspired visual stories.&rdquo;
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.25rem' }}>
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
                  className="btn-manga btn-manga-red glitch-hover"
                  onClick={() => soundFx.playSlash()}
                  onMouseEnter={() => soundFx.playHover()}
                >
                  <Paintbrush size={18} /> COMMISSION ME
                </Link>
              </div>

              {/* Studio Metadata Technical Ribbon */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  marginTop: '0.5rem',
                  borderTop: '1px dashed var(--border-color)',
                  paddingTop: '0.85rem'
                }}
              >
                <div>STATUS: <strong style={{ color: '#22c55e' }}>ONLINE // OPEN</strong></div>
                <div>MEDIUM: <strong style={{ color: 'var(--text-primary)' }}>CLIP STUDIO / KRITA</strong></div>
                <div>STUDIO: <strong style={{ color: 'var(--text-primary)' }}>PHILIPPINES</strong></div>
              </div>
            </div>

            {/* Right Manga Panel Composition (Hero Cover + Cinematic Eye Strip) */}
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Main Character Manga Cover Panel */}
              <div
                className="manga-panel-card cut-corner"
                style={{
                  width: '100%',
                  maxWidth: '480px',
                  aspectRatio: '1 / 1.12',
                  overflow: 'hidden',
                  margin: '0 auto',
                  position: 'relative'
                }}
              >
                {/* Technical Drafting Corner Marks */}
                <span className="drafting-corner-mark-tl">+</span>
                <span className="drafting-corner-mark-tr">+</span>
                <span className="drafting-corner-mark-bl">+</span>
                <span className="drafting-corner-mark-br">+</span>

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

                {/* Narrator Tag in corner */}
                <div
                  style={{
                    position: 'absolute',
                    top: '0.85rem',
                    left: '0.85rem',
                    zIndex: 2
                  }}
                >
                  <span className="manga-narrator-box manga-narrator-box-red">
                    COVER // VOL. 01
                  </span>
                </div>

                <div
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    padding: '1.2rem',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 100%)',
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
                    <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--accent-yellow)' }}>
                      INK & DIGITAL SCREENTONE
                    </div>
                  </div>
                  <span className="font-mono" style={{ fontSize: '0.72rem', opacity: 0.85 }}>
                    SERIES 2026
                  </span>
                </div>
              </div>

              {/* Cinematic 3-Panel Eye Focus Strip (Inspired by Reference 2) */}
              <div
                style={{
                  maxWidth: '480px',
                  width: '100%',
                  margin: '0 auto',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '0.5rem',
                  border: '2px solid var(--border-bold)',
                  padding: '4px',
                  backgroundColor: 'var(--bg-card)',
                  boxShadow: '3px 3px 0px var(--border-bold)'
                }}
              >
                <div
                  style={{
                    height: '65px',
                    overflow: 'hidden',
                    position: 'relative',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-tertiary)'
                  }}
                  title="Aidan Burn Expression Study"
                >
                  <img
                    src="/artworks/personal%20works/aidan%20burn2.png"
                    alt="Aidan Eye Focus"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: '50% 30%'
                    }}
                  />
                  <span
                    className="font-mono"
                    style={{
                      position: 'absolute',
                      bottom: '2px',
                      left: '3px',
                      fontSize: '0.55rem',
                      background: 'rgba(0,0,0,0.75)',
                      color: '#fff',
                      padding: '1px 3px'
                    }}
                  >
                    FOCUS 01
                  </span>
                </div>

                <div
                  style={{
                    height: '65px',
                    overflow: 'hidden',
                    position: 'relative',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-tertiary)'
                  }}
                  title="Edgerunners Kinetic Action"
                >
                  <img
                    src="/artworks/commissioned%20work/final%20edgeunners.png"
                    alt="Kinetic Action Focus"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: '60% 35%'
                    }}
                  />
                  <span
                    className="font-mono"
                    style={{
                      position: 'absolute',
                      bottom: '2px',
                      left: '3px',
                      fontSize: '0.55rem',
                      background: 'rgba(0,0,0,0.75)',
                      color: 'var(--accent-red)',
                      padding: '1px 3px',
                      fontWeight: 700
                    }}
                  >
                    ACTION 02
                  </span>
                </div>

                <div
                  style={{
                    height: '65px',
                    overflow: 'hidden',
                    position: 'relative',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-tertiary)'
                  }}
                  title="Chainsaw Man Inked Study"
                >
                  <img
                    src="/artworks/personal%20works/chainsaw%20man.png"
                    alt="Chainsaw Man Inked Study"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: '50% 25%'
                    }}
                  />
                  <span
                    className="font-mono"
                    style={{
                      position: 'absolute',
                      bottom: '2px',
                      left: '3px',
                      fontSize: '0.55rem',
                      background: 'rgba(0,0,0,0.75)',
                      color: '#fff',
                      padding: '1px 3px'
                    }}
                  >
                    INK 03
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          FEATURED ARTWORKS GALLERY PREVIEW (Manga Catalog Style, Ref 1)
          ======================================================== */}
      <section style={{ padding: '5.5rem 0', position: 'relative' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '1.5rem',
              marginBottom: '2.5rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span className="speech-bubble">VOL. 01 — 06</span>
                <div className="section-subtitle" style={{ margin: 0 }}>CURATED MANGA SELECTION</div>
              </div>
              <h2 className="section-title">FEATURED ARTWORKS</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', maxWidth: '540px' }}>
                Hand-picked original character illustrations, dynamic anime compositions, and client works directly from the drafting desk.
              </p>
            </div>
            <Link to="/artworks" className="btn-manga btn-manga-secondary">
              OPEN FULL CATALOG (64 WORKS) <ArrowRight size={18} />
            </Link>
          </div>

          {/* Manga Page Grid (Gutters & Inked Borders, Ref 1) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {featuredWorks.map((art, idx) => (
              <div
                key={art.id}
                className="manga-panel-card glitch-hover"
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
                {/* Technical Corner Marks */}
                <span className="drafting-corner-mark-tl">+</span>
                <span className="drafting-corner-mark-tr">+</span>

                {/* Artwork Thumbnail Container */}
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: idx % 2 === 0 ? '4 / 5' : '1 / 1',
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderBottom: '2px solid var(--text-primary)'
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

                  {/* Corner Narrator Badge */}
                  <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
                    <span className="manga-narrator-box">
                      ACT 0{idx + 1} // {art.categoryName}
                    </span>
                  </div>
                </div>

                {/* Card Editorial Metadata (Matching Manga Chapter Layout, Ref 1) */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--accent-red)', fontWeight: 700 }}>
                      VOL. 0{idx + 1} CHAPTER RELEASE
                    </span>
                    <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      DIGITAL INK
                    </span>
                  </div>

                  <h3 className="font-heading" style={{ fontSize: '1.5rem', letterSpacing: '0.04em', color: 'var(--text-primary)' }}>
                    {art.title}
                  </h3>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '0.5rem',
                      paddingTop: '0.5rem',
                      borderTop: '1px dashed var(--border-color)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)'
                    }}
                  >
                    <span>INSPECT FULL ARTWORK</span>
                    <ArrowRight size={14} color="var(--accent-red)" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          ARTIST INTRO SECTION (Mangaka Workbench Desk, Ref 3 & 4)
          ======================================================== */}
      <section
        style={{
          padding: '5.5rem 0',
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '2.5px solid var(--text-primary)',
          borderBottom: '2.5px solid var(--text-primary)',
          position: 'relative'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'center'
            }}
          >
            {/* Visual Portrait in Mangaka Desk Frame */}
            <div style={{ position: 'relative' }}>
              <div
                className="manga-panel-card cut-corner"
                style={{
                  width: '100%',
                  maxWidth: '430px',
                  aspectRatio: '1 / 1',
                  margin: '0 auto',
                  border: '2.5px solid var(--text-primary)',
                  boxShadow: '8px 8px 0px var(--accent-red)',
                  overflow: 'hidden'
                }}
              >
                <img
                  src="/artworks/my%20photo/juswa pogi.jpg"
                  alt="Joshua Lagare (JUSWADRAWS Self Portrait)"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                <span className="drafting-corner-mark-tl">+</span>
                <span className="drafting-corner-mark-br">+</span>
              </div>

              {/* Speech Bubble Tag on Desk (Ref 3) */}
              <div
                style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '12%'
                }}
              >
                <div className="speech-bubble">
                  <span>THE ARTIST BEHIND THE BRUSH</span>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="section-subtitle">ARTIST DOSSIER // MANGA ROOTS</div>
              <h2 className="section-title">MEET JUSWADRAWS</h2>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7' }}>
                Hey, I’m <strong>Joshua</strong>—better known online as <strong>JUSWADRAWS</strong>. I’m an independent digital illustrator from the Philippines with a lifelong passion for high-energy character design, action illustration, and expressive manga storytelling.
              </p>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                My creative style is fueled by the raw, ink-heavy impact of modern manga like <em>Gachiakuta</em>, the kinetic heroic energy of <em>My Hero Academia</em>, and experimental urban street art. Whether I’m designing original character sheets (OCs) or bringing client concepts to life, every piece is drawn with intention, rhythm, and grit.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.25rem' }}>
                <Link to="/about" className="btn-manga">
                  READ ARTIST BIO <ArrowRight size={18} />
                </Link>
                <Link to="/sketch-wall" className="btn-manga btn-manga-secondary">
                  VISIT COMMUNITY WALL
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
          INTERACTIVE SKETCHPAD CALLOUT BANNER (Ref 4 Drafting Mat)
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
            className="manga-panel-card cut-corner-both"
            style={{
              padding: 'clamp(2rem, 5vw, 3.5rem)',
              backgroundColor: 'var(--bg-card)',
              border: '2.5px solid var(--text-primary)',
              boxShadow: '8px 8px 0px var(--accent-red)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <span className="drafting-corner-mark-tl">+</span>
            <span className="drafting-corner-mark-tr">+</span>
            <span className="drafting-corner-mark-bl">+</span>
            <span className="drafting-corner-mark-br">+</span>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <div className="speech-bubble">
                  <span>COMMUNITY CANVAS</span>
                </div>
                <span className="manga-narrator-box manga-narrator-box-red">LIVE WALL</span>
              </div>
              <h2 className="font-heading" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', lineHeight: 0.95, color: 'var(--text-primary)' }}>
                LEAVE A NOTE / DOODLE TO THE ARTIST
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.85rem', fontSize: '1rem', lineHeight: '1.6' }}>
                Pick up a digital brush, sketch a character, sign your tag, or drop a handwritten note directly onto the community canvas. Approved doodles appear forever on the public artist wall!
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
              <div className="font-mono" style={{ fontSize: '0.82rem', color: 'var(--accent-yellow)' }}>
                ✦ INCLUDES BRUSH SIZES, MULTI-COLOR INKS, ERASER & PNG EXPORT
              </div>
              <Link to="/sketch-wall" className="btn-manga btn-manga-red" style={{ fontSize: '1.25rem', padding: '0.9rem 2rem' }}>
                <Paintbrush size={20} /> OPEN SKETCHPAD NOW
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
