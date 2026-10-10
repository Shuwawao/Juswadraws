import React from 'react';
import { Link } from 'react-router-dom';
import { Paintbrush, Instagram, Facebook, Mail, ArrowRight, Sparkles, Heart } from 'lucide-react';
import SoftwareTools from '../components/SoftwareTools';

export default function About() {
  return (
    <div style={{ padding: 'clamp(2rem, 5vw, 4rem) 0' }}>
      <div className="container">
        {/* Main Header / Intro */}
        <div style={{ marginBottom: '4rem' }}>
          <div className="section-subtitle">THE ARTIST BEHIND THE PEN // 02</div>
          <h1 className="section-title">ABOUT JUSWADRAWS</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.6rem', fontSize: '1.1rem', maxWidth: '650px' }}>
            Digital artist, character illustrator, and visual storyteller exploring gritty anime aesthetics, expressive lineart, and dynamic character concepts.
          </p>
        </div>

        {/* Editorial Profile Composition */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(2.5rem, 5vw, 5rem)',
            alignItems: 'center',
            marginBottom: '6rem'
          }}
        >
          {/* Portrait Composition (Drawing #3: Untitled Design.png) */}
          <div style={{ position: 'relative' }}>
            <div
              className="manga-panel cut-corner"
              style={{
                width: '100%',
                maxWidth: '480px',
                aspectRatio: '1 / 1.3',
                margin: '0 auto',
                border: '3px solid var(--text-primary)',
                boxShadow: '12px 12px 0px var(--accent-purple)',
                overflow: 'hidden'
              }}
            >
              <img
                src="/artworks/my%20photo/Untitled%20Design.png"
                alt="JUSWADRAWS Full Character Illustration"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div
              className="tape-tag tape-tag-yellow"
              style={{
                position: 'absolute',
                bottom: '-12px',
                left: '5%',
                background: 'var(--accent-yellow-tape)',
                color: '#000',
                fontSize: '0.85rem'
              }}
            >
              ORIGINAL CHARACTER ART // PH
            </div>
          </div>

          {/* Bio Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className="tape-tag tape-tag-purple">JOSHUA LAGARE</span>
              <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                ALIAS: JUSWADRAWS
              </span>
            </div>

            <h2 className="font-heading" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: 1 }}>
              &ldquo;DRAWING IS HOW I BRING CHARACTERS TO LIFE.&rdquo;
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7' }}>
              <p>
                I am a digital illustrator who loves exploring strong character personalities, intense kinetic action scenes, and memorable costume designs. Drawing isn’t just a craft for me—it’s an ongoing sketchbook universe where imagination meets ink.
              </p>
              <p>
                My artistic style draws heavy inspiration from modern, punchy manga and anime aesthetics—in particular, the bold graphic linework and graffiti-grunge aesthetic of <strong>Gachiakuta</strong>, paired with the heroic energy and dynamic anatomical rhythm of <strong>My Hero Academia (MHA)</strong>.
              </p>
              <p>
                I specialize in <strong>Original Character (OC) design sheets</strong>, custom anime portraits, fantasy characters, fan art tributes, and full character commissions for clients across the globe.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                borderTop: '2px solid var(--border-bold)',
                paddingTop: '1.5rem',
                fontFamily: 'var(--font-mono)'
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>SPECIALIZATION:</span>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>OC Design & Anime Action</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>COMMISSION STATUS:</span>
                <div style={{ fontWeight: 700, color: '#22c55e' }}>Open (1-Week Turnaround)</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
              <Link to="/commissions" className="btn-manga">
                <Paintbrush size={18} /> VIEW COMMISSIONS & PRICING
              </Link>
              <Link to="/contact" className="btn-manga btn-manga-secondary">
                GET IN TOUCH <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* Software Tools Component */}
        <SoftwareTools />

        {/* Official Social Media Channels */}
        <section
          style={{
            marginTop: '5rem',
            padding: '4rem 2rem',
            backgroundColor: 'var(--bg-secondary)',
            border: '2px solid var(--border-bold)',
            boxShadow: '6px 6px 0px var(--border-color)'
          }}
        >
          <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
            <div className="section-subtitle" style={{ justifyContent: 'center' }}>
              FOLLOW THE JOURNEY
            </div>
            <h2 className="font-heading" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
              OFFICIAL SOCIAL MEDIA
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Keep up with my newest WIP sketches, daily drawings, character design speedpaints, and personal updates on my verified profiles:
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}
            >
              <a
                href="https://www.instagram.com/juswa_draws"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-manga btn-manga-secondary"
                style={{ padding: '1rem' }}
              >
                <Instagram size={18} color="var(--accent-purple)" />
                <span>@juswa_draws</span>
              </a>

              <a
                href="https://www.instagram.com/shuwawao"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-manga btn-manga-secondary"
                style={{ padding: '1rem' }}
              >
                <Instagram size={18} color="var(--accent-cyan)" />
                <span>@shuwawao</span>
              </a>

              <a
                href="https://www.facebook.com/share/1F1aA2ChW4/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-manga btn-manga-secondary"
                style={{ padding: '1rem' }}
              >
                <Facebook size={18} color="#3b82f6" />
                <span>Facebook</span>
              </a>

              <a
                href="mailto:joshualagare255@gmail.com"
                className="btn-manga btn-manga-secondary"
                style={{ padding: '1rem' }}
              >
                <Mail size={18} color="var(--accent-yellow)" />
                <span>Email Me</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
