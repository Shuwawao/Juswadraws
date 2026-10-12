import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Maximize2, Tag } from 'lucide-react';
import soundFx from '../utils/soundFx';

export default function ImageViewerModal({ artwork, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const handleClose = useCallback(() => {
    soundFx.playPop();
    onClose();
  }, [onClose]);

  const handlePrevClick = useCallback(() => {
    soundFx.playClick();
    onPrev();
  }, [onPrev]);

  const handleNextClick = useCallback(() => {
    soundFx.playClick();
    onNext();
  }, [onNext]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft' && hasPrev) handlePrevClick();
      if (e.key === 'ArrowRight' && hasNext) handleNextClick();
    },
    [handleClose, handlePrevClick, handleNextClick, hasPrev, hasNext]
  );

  useEffect(() => {
    soundFx.playWhoosh();
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  if (!artwork) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={artwork.title}
      className="modal-overlay-anim"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        backgroundColor: 'rgba(5, 5, 8, 0.94)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(1rem, 2.5vw, 2rem)',
        overflow: 'hidden'
      }}
      onClick={handleClose}
    >
      {/* Top Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          zIndex: 10,
          color: '#ffffff'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span className="tape-tag" style={{ background: 'var(--accent-yellow-tape)', color: '#000' }}>
            {artwork.categoryName || 'ARTWORK'}
          </span>
          <span className="font-heading" style={{ fontSize: '1.4rem', letterSpacing: '0.04em' }}>
            {artwork.title}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <a
            href={artwork.url}
            target="_blank"
            rel="noopener noreferrer"
            download
            onClick={() => soundFx.playSuccess()}
            className="btn-manga-secondary"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', color: '#fff', borderColor: '#444' }}
            title="Open / Download Full Resolution"
          >
            <Download size={16} /> <span style={{ display: 'none' }} className="d-md-inline">FULL RES</span>
          </a>
          <button
            onClick={handleClose}
            aria-label="Close image viewer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              backgroundColor: '#1f1f2a',
              border: '2px solid #ffffff',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <X size={22} />
          </button>
        </div>
      </div>

      {/* Center Image Display with Arrow Navigation */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '1rem 0',
          maxHeight: 'calc(100vh - 160px)'
        }}
      >
        {/* Previous Button */}
        {hasPrev && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevClick();
            }}
            aria-label="Previous artwork"
            style={{
              position: 'absolute',
              left: '0.5rem',
              zIndex: 10,
              width: '50px',
              height: '50px',
              backgroundColor: 'rgba(20, 20, 28, 0.85)',
              border: '2px solid #fff',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '3px 3px 0px var(--accent-purple)'
            }}
          >
            <ChevronLeft size={28} />
          </button>
        )}

        <img
          key={artwork.url}
          src={artwork.url}
          alt={artwork.title}
          className="modal-image-anim"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
            border: '2px solid rgba(255,255,255,0.15)'
          }}
          onClick={(e) => e.stopPropagation()}
        />

        {/* Next Button */}
        {hasNext && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextClick();
            }}
            aria-label="Next artwork"
            style={{
              position: 'absolute',
              right: '0.5rem',
              zIndex: 10,
              width: '50px',
              height: '50px',
              backgroundColor: 'rgba(20, 20, 28, 0.85)',
              border: '2px solid #fff',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '3px 3px 0px var(--accent-purple)'
            }}
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>

      {/* Bottom Info Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          color: '#aaa',
          fontSize: '0.85rem',
          fontFamily: 'var(--font-mono)',
          paddingTop: '0.8rem',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span>COLLECTION: <strong style={{ color: '#fff' }}>{artwork.folder}</strong></span>
          <span>•</span>
          <span>FILE: <strong style={{ color: '#fff' }}>{artwork.cleanFileName || artwork.fileName}</strong></span>
        </div>
        <div>
          <span>Press <kbd style={{ padding: '0.1rem 0.4rem', background: '#333', color: '#fff' }}>ESC</kbd> to close / <kbd style={{ padding: '0.1rem 0.4rem', background: '#333', color: '#fff' }}>←</kbd> <kbd style={{ padding: '0.1rem 0.4rem', background: '#333', color: '#fff' }}>→</kbd> to navigate</span>
        </div>
      </div>
    </div>
  );
}
