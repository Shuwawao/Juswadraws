import React from 'react';
import { Cpu, Terminal, Palette, PenTool } from 'lucide-react';

export default function SoftwareTools() {
  const tools = [
    {
      name: 'CLIP STUDIO PAINT',
      role: 'Primary Illustration & Manga Inking',
      desc: 'Mastery over G-pen stabilization, screentones, line weights, and dynamic anime action poses.',
      color: '#00a0e9',
      tag: 'DAILY DRIVER',
      // Stylized CSP Logo SVG
      iconSvg: (
        <svg viewBox="0 0 48 48" width="36" height="36" fill="currentColor">
          <circle cx="24" cy="24" r="22" fill="#00a0e9" />
          <path d="M14 26c0-6 5-11 11-11 4 0 7 2 9 5l-4 3c-1-2-3-3-5-3-3.3 0-6 2.7-6 6s2.7 6 6 6c2 0 4-1 5-3l4 3c-2 3-5 5-9 5-6 0-11-5-11-11z" fill="#ffffff" />
          <path d="M26 18l6-6 4 4-6 6z" fill="#ffd100" />
        </svg>
      )
    },
    {
      name: 'KRITA',
      role: 'Digital Painting & Concept Art',
      desc: 'Extensive use of custom textured brushes, color smudge dynamics, and expressive rough concept studies.',
      color: '#3498db',
      tag: 'STUDY & TEXTURE',
      iconSvg: (
        <svg viewBox="0 0 48 48" width="36" height="36" fill="currentColor">
          <circle cx="24" cy="24" r="22" fill="#2c3e50" />
          <circle cx="20" cy="22" r="12" fill="#3498db" />
          <circle cx="28" cy="26" r="10" fill="#e74c3c" />
          <circle cx="22" cy="30" r="8" fill="#f1c40f" />
          <path d="M14 14l20 20" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
        </svg>
      )
    },
    {
      name: 'ADOBE PHOTOSHOP',
      role: 'Post-Processing & Color Grading',
      desc: 'Halftone screening, chromatic aberration, grain overlay, levels, and publication-ready finishes.',
      color: '#31a8ff',
      tag: 'POST-PRODUCTION',
      iconSvg: (
        <svg viewBox="0 0 48 48" width="36" height="36" fill="currentColor">
          <rect width="44" height="44" x="2" y="2" rx="8" fill="#001e36" stroke="#31a8ff" strokeWidth="2" />
          <text x="12" y="32" fill="#31a8ff" fontSize="24" fontWeight="bold" fontFamily="sans-serif">Ps</text>
        </svg>
      )
    },
    {
      name: 'MAGMA',
      role: 'Collaborative Live Canvas',
      desc: 'Real-time collaborative drawing sessions, speed sketching with other artists, and community stream jams.',
      color: '#ff4757',
      tag: 'COLLAB & SPEED',
      iconSvg: (
        <svg viewBox="0 0 48 48" width="36" height="36" fill="currentColor">
          <circle cx="24" cy="24" r="22" fill="#ff4757" />
          <path d="M14 34L24 14L34 34L28 34L24 24L20 34Z" fill="#ffffff" />
          <circle cx="24" cy="28" r="3" fill="#ffeaa7" />
        </svg>
      )
    }
  ];

  return (
    <section style={{ padding: '5rem 0', position: 'relative' }}>
      <div className="container">
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="section-subtitle">WEAPONS OF CHOICE</div>
          <h2 className="section-title">MY TOOLS OF THE TRADE</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.6rem', maxWidth: '600px' }}>
            From high-octane lineart to gritty textures and color grading, these are the software packages powering my digital illustration workflow.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {tools.map((tool, idx) => (
            <div
              key={tool.name}
              className="manga-panel"
              style={{
                padding: '1.8rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: `4px solid ${tool.color}`
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                  <div style={{ filter: 'drop-shadow(2px 2px 0px rgba(0,0,0,0.5))' }}>
                    {tool.iconSvg}
                  </div>
                  <span className="tape-tag" style={{ fontSize: '0.68rem' }}>
                    {tool.tag}
                  </span>
                </div>

                <h3 className="font-heading" style={{ fontSize: '1.5rem', marginBottom: '0.3rem', color: 'var(--text-primary)' }}>
                  {tool.name}
                </h3>
                <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--accent-purple)', marginBottom: '0.8rem', fontWeight: 600 }}>
                  {tool.role}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.5' }}>
                  {tool.desc}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem', borderTop: '1px dashed var(--border-color)', paddingTop: '0.8rem' }}>
                <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  SLOT 0{idx + 1} // ACTIVE
                </span>
                <span style={{ width: '6px', height: '6px', backgroundColor: tool.color, borderRadius: '50%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
