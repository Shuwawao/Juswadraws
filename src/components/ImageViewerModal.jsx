import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Download, RefreshCw, AlertTriangle } from 'lucide-react';
import soundFx from '../utils/soundFx';

export default function ImageViewerModal({
  artwork,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  prevArtwork,
  nextArtwork
}) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

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

  // Keyboard navigation & lock body scroll
  useEffect(() => {
    soundFx.playWhoosh();
    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [handleKeyDown]);

  // Preload current image and adjacent items whenever artwork changes
  useEffect(() => {
    if (!artwork?.url) return;

    setIsImageLoading(true);
    setHasError(false);

    const activeImg = new Image();
    activeImg.src = artwork.url;
    activeImg.onload = () => {
      setIsImageLoading(false);
    };
    activeImg.onerror = () => {
      setIsImageLoading(false);
      setHasError(true);
    };

    // Preload next image into browser cache
    if (hasNext && nextArtwork?.url) {
      const preloadNext = new Image();
      preloadNext.src = nextArtwork.url;
    }
    // Preload previous image into browser cache
    if (hasPrev && prevArtwork?.url) {
      const preloadPrev = new Image();
      preloadPrev.src = prevArtwork.url;
    }
  }, [artwork?.url, retryKey, hasNext, hasPrev, nextArtwork?.url, prevArtwork?.url]);

  if (!artwork || typeof document === 'undefined') return null;

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={artwork.title}
      className="modal-overlay-anim"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999, // Ensure top of everything on the page
        backgroundColor: 'rgba(5, 5, 8, 0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(1rem, 2.5vw, 2rem)',
        overflow: 'hidden',
        width: '100vw',
        height: '100vh',
        boxSizing: 'border-box'
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
          color: '#ffffff',
          flexShrink: 0
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', minWidth: 0 }}>
          <span
            className="tape-tag"
            style={{
              background: 'var(--accent-yellow-tape)',
              color: '#000',
              flexShrink: 0
            }}
          >
            {artwork.categoryName || 'ARTWORK'}
          </span>
          <span
            className="font-heading"
            style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {artwork.title}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
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
              cursor: 'pointer',
              boxShadow: '2px 2px 0px var(--accent-red)'
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
          width: '100%',
          minHeight: 0,
          overflow: 'hidden'
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
              left: 'clamp(0.5rem, 2vw, 1.5rem)',
              zIndex: 20,
              width: '50px',
              height: '50px',
              backgroundColor: 'rgba(20, 20, 28, 0.9)',
              border: '2px solid #fff',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '3px 3px 0px var(--accent-red)'
            }}
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* Loading Spinner Indicator */}
        {isImageLoading && !hasError && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              position: 'absolute',
              zIndex: 5
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                border: '3px solid rgba(255, 255, 255, 0.15)',
                borderTopColor: 'var(--accent-yellow)',
                borderRightColor: 'var(--accent-purple)',
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite'
              }}
            />
            <span
              className="font-mono"
              style={{
                fontSize: '0.78rem',
                letterSpacing: '0.12em',
                color: 'var(--accent-yellow)'
              }}
            >
              LOADING ARTWORK...
            </span>
          </div>
        )}

        {/* Error Fallback */}
        {hasError ? (
          <div
            className="manga-panel"
            style={{
              padding: '2.5rem 2rem',
              textAlign: 'center',
              maxWidth: '420px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              backgroundColor: 'var(--bg-card)',
              zIndex: 10
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <AlertTriangle size={42} color="var(--accent-yellow)" />
            <h3 className="font-heading" style={{ fontSize: '1.5rem' }}>
              IMAGE FAILED TO LOAD
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.4' }}>
              Unable to load the file &ldquo;{artwork.cleanFileName || artwork.title}&rdquo;.
            </p>
            <button
              onClick={() => setRetryKey((k) => k + 1)}
              className="btn-manga"
              style={{ fontSize: '0.9rem', padding: '0.5rem 1.4rem' }}
            >
              <RefreshCw size={15} /> RETRY LOADING
            </button>
          </div>
        ) : (
          /* Actual High-Res Artwork Image */
          <img
            key={`${artwork.url}-${retryKey}`}
            src={artwork.url}
            alt={artwork.title}
            decoding="async"
            className="modal-image-anim"
            onLoad={() => setIsImageLoading(false)}
            onError={() => {
              setIsImageLoading(false);
              setHasError(true);
            }}
            style={{
              maxWidth: '100%',
              maxHeight: 'calc(100vh - 170px)',
              objectFit: 'contain',
              boxShadow: isImageLoading ? 'none' : '0 12px 48px rgba(0,0,0,0.85)',
              border: isImageLoading ? 'none' : '2px solid rgba(255,255,255,0.2)',
              opacity: isImageLoading ? 0 : 1,
              transform: isImageLoading ? 'scale(0.96)' : 'scale(1)',
              transition: 'opacity 0.25s ease, transform 0.25s ease',
              display: 'block'
            }}
            onClick={(e) => e.stopPropagation()}
          />
        )}

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
              right: 'clamp(0.5rem, 2vw, 1.5rem)',
              zIndex: 20,
              width: '50px',
              height: '50px',
              backgroundColor: 'rgba(20, 20, 28, 0.9)',
              border: '2px solid #fff',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '3px 3px 0px var(--accent-red)'
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
          borderTop: '1px solid rgba(255,255,255,0.1)',
          flexShrink: 0
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

  // Render directly into document.body to escape any parent transform/scroll contexts
  return createPortal(modalContent, document.body);
}
