import React from 'react';

export default function SoftwareTools() {
  const tools = [
    {
      name: 'CLIP STUDIO PAINT',
      role: 'Primary Illustration & Manga Inking',
      desc: 'Mastery over G-pen stabilization, screentones, line weights, and dynamic anime action poses.',
      color: '#00a0e9',
      tag: 'DAILY DRIVER',
      iconSrc: '/images/tools/clip-studio-paint.png',
      iconAlt: 'Clip Studio Paint official application icon'
    },
    {
      name: 'KRITA',
      role: 'Digital Painting & Concept Art',
      desc: 'Extensive use of custom textured brushes, color smudge dynamics, and expressive rough concept studies.',
      color: '#3498db',
      tag: 'STUDY & TEXTURE',
      iconSrc: '/images/tools/krita.svg',
      iconAlt: 'Krita official application icon'
    },
    {
      name: 'ADOBE PHOTOSHOP',
      role: 'Post-Processing & Color Grading',
      desc: 'Halftone screening, chromatic aberration, grain overlay, levels, and publication-ready finishes.',
      color: '#31a8ff',
      tag: 'POST-PRODUCTION',
      iconSrc: '/images/tools/photoshop.svg',
      iconAlt: 'Adobe Photoshop official application icon'
    },
    {
      name: 'MAGMA',
      role: 'Collaborative Live Canvas',
      desc: 'Real-time collaborative drawing sessions, speed sketching with other artists, and community stream jams.',
      color: '#ff4757',
      tag: 'COLLAB & SPEED',
      iconSrc: '/images/tools/magma.png',
      iconAlt: 'Magma official application icon'
    }
  ];

  return (
    <section style={{ padding: '5rem 0', position: 'relative' }}>
      <div className="container">
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div className="speech-bubble">
              <span>MANUSCRIPT TOOLS</span>
            </div>
            <div className="section-subtitle" style={{ margin: 0 }}>STUDIO GEAR & SOFTWARE</div>
          </div>
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
              className="manga-panel-card"
              style={{
                padding: '1.8rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: `5px solid ${tool.color}`,
                position: 'relative'
              }}
            >
              <span className="drafting-corner-mark-tr">+</span>
              <span className="drafting-corner-mark-br">+</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      filter: 'drop-shadow(2px 2px 0px rgba(0,0,0,0.35))'
                    }}
                  >
                    <img
                      src={tool.iconSrc}
                      alt={tool.iconAlt}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                      loading="lazy"
                    />
                  </div>
                  <span className="tape-tag" style={{ fontSize: '0.68rem' }}>
                    {tool.tag}
                  </span>
                </div>

                <h3 className="font-heading" style={{ fontSize: '1.5rem', marginBottom: '0.3rem', color: 'var(--text-primary)' }}>
                  {tool.name}
                </h3>
                <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--accent-red)', marginBottom: '0.8rem', fontWeight: 600 }}>
                  {tool.role}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.5' }}>
                  {tool.desc}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem', borderTop: '1px dashed var(--border-color)', paddingTop: '0.8rem' }}>
                <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  SLOT 0{idx + 1} • ACTIVE
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
