import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Paintbrush,
  Eraser,
  Undo2,
  Redo2,
  Trash2,
  Download,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Palette,
  Eye,
  MessageSquare,
  Clock,
  User
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

const PALETTE = [
  { name: 'Ink Black', color: '#0a0a0e' },
  { name: 'Pure White', color: '#ffffff' },
  { name: 'Ultraviolet', color: '#9d4edd' },
  { name: 'Highlighter Yellow', color: '#facc15' },
  { name: 'Blood Crimson', color: '#ef4444' },
  { name: 'Neon Cyan', color: '#06b6d4' },
  { name: 'Lime Green', color: '#22c55e' },
  { name: 'Manga Orange', color: '#f97316' }
];

const BRUSH_SIZES = [
  { label: 'Fine (2px)', size: 2 },
  { label: 'Pen (6px)', size: 6 },
  { label: 'Marker (14px)', size: 14 },
  { label: 'Heavy (26px)', size: 26 }
];

export default function SketchWall() {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });

  // Tool state
  const [brushColor, setBrushColor] = useState('#0a0a0e');
  const [brushSize, setBrushSize] = useState(6);
  const [isEraser, setIsEraser] = useState(false);
  const [canvasBg, setCanvasBg] = useState('#ffffff'); // Canvas paper background

  // Undo / Redo history stack
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Form submission state
  const [nickname, setNickname] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Approved Community Wall list
  const [approvedDoodles, setApprovedDoodles] = useState([]);
  const [isLoadingDoodles, setIsLoadingDoodles] = useState(true);
  const [wallError, setWallError] = useState(null);

  // Initialize Canvas with proper dimensions and DPR
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Initial background fill
    ctx.fillStyle = canvasBg;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Initial history snapshot
    const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([initialData]);
    setHistoryIndex(0);
  }, [canvasBg]);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  // Fetch approved community doodles from Supabase
  const fetchApprovedDoodles = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoadingDoodles(false);
      return;
    }

    try {
      setIsLoadingDoodles(true);
      setWallError(null);
      const { data, error } = await supabase
        .from('doodles')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApprovedDoodles(data || []);
    } catch (err) {
      console.warn('Error fetching approved doodles:', err);
      setWallError('Could not load community doodles. Backend connection issue.');
    } finally {
      setIsLoadingDoodles(false);
    }
  }, []);

  useEffect(() => {
    fetchApprovedDoodles();
  }, [fetchApprovedDoodles]);

  // Save snapshot to history
  const saveSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(snapshot);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo action
  const handleUndo = () => {
    if (historyIndex <= 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const newIdx = historyIndex - 1;
    ctx.putImageData(history[newIdx], 0, 0);
    setHistoryIndex(newIdx);
  };

  // Redo action
  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const newIdx = historyIndex + 1;
    ctx.putImageData(history[newIdx], 0, 0);
    setHistoryIndex(newIdx);
  };

  // Clear Canvas with user confirmation
  const handleClear = () => {
    if (window.confirm('Clear your entire sketchpad canvas?')) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      ctx.fillStyle = canvasBg;
      ctx.fillRect(0, 0, rect.width, rect.height);
      saveSnapshot();
    }
  };

  // Get pointer coordinates relative to canvas
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  // Start Drawing
  const startDrawing = (e) => {
    const coords = getCoordinates(e);
    isDrawing.current = true;
    lastPoint.current = coords;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(coords.x, coords.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = isEraser ? canvasBg : brushColor;
    ctx.fill();
  };

  // Draw Stroke
  const draw = (e) => {
    if (!isDrawing.current) return;
    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = isEraser ? canvasBg : brushColor;

    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    lastPoint.current = coords;
  };

  // End Drawing
  const stopDrawing = () => {
    if (isDrawing.current) {
      isDrawing.current = false;
      saveSnapshot();
    }
  };

  // Local PNG Download
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const link = document.createElement('a');
      link.download = `juswadraws-doodle-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      alert('Failed to export canvas PNG: ' + err.message);
    }
  };

  // Post to the Wall (Submit for Moderation)
  const handlePostToWall = async (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      if (!isSupabaseConfigured || !supabase) {
        throw new Error(
          'Supabase database & storage are not configured yet. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable moderated community posting.'
        );
      }

      // Convert canvas to blob
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Could not generate image data from canvas.');

      const fileName = `doodle-${Date.now()}-${Math.random().toString(36).substring(7)}.png`;

      // 1. Upload to Supabase Storage 'doodles' bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('doodles')
        .upload(fileName, blob, { contentType: 'image/png' });

      if (uploadError) throw new Error('Storage upload failed: ' + uploadError.message);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage.from('doodles').getPublicUrl(fileName);

      // 2. Insert into doodles table with status = 'pending'
      const { error: insertError } = await supabase.from('doodles').insert([
        {
          nickname: nickname.trim() || 'Anonymous Artist',
          message: note.trim() || '',
          image_url: publicUrl,
          status: 'pending' // Enforced by RLS
        }
      ]);

      if (insertError) throw new Error('Database insert failed: ' + insertError.message);

      // Fire celebratory confetti!
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });

      setSubmissionSuccess(true);
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMessage(err.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 'clamp(2rem, 5vw, 4rem) 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <div className="section-subtitle">COMMUNITY CANVAS // 04</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}>
            <h1 className="section-title">LEAVE A NOTE / DOODLE TO THE ARTIST</h1>
            <span className="tape-tag tape-tag-red">INTERACTIVE SKETCHPAD</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.6rem', fontSize: '1.05rem', maxWidth: '720px' }}>
            Draw a sketch, write a friendly tag, or leave a handwritten message for Joshua! All doodles are reviewed and featured on the permanent community wall.
          </p>
        </div>

        {/* Success Confirmation Modal / Banner */}
        {submissionSuccess && (
          <div
            className="manga-panel cut-corner"
            style={{
              padding: '2.5rem',
              backgroundColor: 'rgba(34, 197, 94, 0.08)',
              border: '2px solid #22c55e',
              marginBottom: '3rem',
              textAlign: 'center'
            }}
          >
            <CheckCircle2 size={48} color="#22c55e" style={{ margin: '0 auto 1rem' }} />
            <h3 className="font-heading" style={{ fontSize: '2rem', color: '#22c55e' }}>
              DOODLE SUBMITTED FOR REVIEW!
            </h3>
            <p style={{ color: 'var(--text-primary)', fontSize: '1.05rem', margin: '0.5rem auto 1.5rem', maxWidth: '560px' }}>
              &ldquo;Thanks for leaving a little piece of art! Your doodle has been sent to JUSWADRAWS for review.&rdquo;
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button
                onClick={() => {
                  setSubmissionSuccess(false);
                  setNickname('');
                  setNote('');
                  initCanvas();
                }}
                className="btn-manga"
              >
                SKETCH ANOTHER ONE
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            SKETCHPAD STUDIO WORKBENCH
            ======================================================== */}
        <div
          className="manga-panel cut-corner"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '2px solid var(--text-primary)',
            boxShadow: '8px 8px 0px var(--accent-purple)',
            padding: 'clamp(1rem, 3vw, 2rem)',
            marginBottom: '5rem'
          }}
        >
          {/* Studio Top Control Toolbar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              paddingBottom: '1.2rem',
              borderBottom: '2px solid var(--border-bold)',
              marginBottom: '1.2rem'
            }}
          >
            {/* Color Swatches */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, marginRight: '0.3rem' }}>
                INK:
              </span>
              {PALETTE.map((p) => (
                <button
                  key={p.name}
                  onClick={() => {
                    setBrushColor(p.color);
                    setIsEraser(false);
                  }}
                  title={p.name}
                  aria-label={p.name}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: p.color,
                    border: brushColor === p.color && !isEraser ? '3px solid var(--accent-purple)' : '1px solid rgba(0,0,0,0.3)',
                    boxShadow: brushColor === p.color && !isEraser ? '0 0 8px var(--accent-purple)' : 'none',
                    transform: brushColor === p.color && !isEraser ? 'scale(1.15)' : 'scale(1)',
                    transition: 'transform 0.15s ease'
                  }}
                />
              ))}
            </div>

            {/* Brush Size Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, marginRight: '0.3rem' }}>
                SIZE:
              </span>
              {BRUSH_SIZES.map((b) => (
                <button
                  key={b.size}
                  onClick={() => setBrushSize(b.size)}
                  className={brushSize === b.size ? 'btn-manga' : 'btn-manga btn-manga-secondary'}
                  style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                >
                  {b.size}px
                </button>
              ))}
            </div>

            {/* Action Tools: Eraser, Undo, Redo, Clear */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setIsEraser(!isEraser)}
                className={isEraser ? 'btn-manga' : 'btn-manga btn-manga-secondary'}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                title="Toggle Eraser Mode"
              >
                <Eraser size={16} /> ERASER
              </button>

              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="btn-manga-secondary"
                style={{ padding: '0.4rem 0.6rem', opacity: historyIndex <= 0 ? 0.4 : 1 }}
                title="Undo Stroke"
              >
                <Undo2 size={16} />
              </button>

              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="btn-manga-secondary"
                style={{ padding: '0.4rem 0.6rem', opacity: historyIndex >= history.length - 1 ? 0.4 : 1 }}
                title="Redo Stroke"
              >
                <Redo2 size={16} />
              </button>

              <button
                onClick={handleClear}
                className="btn-manga-secondary"
                style={{ padding: '0.4rem 0.7rem', color: 'var(--accent-red)' }}
                title="Clear Entire Canvas"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* Interactive HTML5 Canvas Area */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '460px',
              backgroundColor: canvasBg,
              border: '2px solid var(--text-primary)',
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              cursor: isEraser ? 'cell' : 'crosshair',
              touchAction: 'none' // Crucial: allows touch drawing without scrolling page
            }}
          >
            <canvas
              ref={canvasRef}
              style={{ width: '100%', height: '100%', display: 'block' }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />

            {/* Canvas Watermark in bottom corner */}
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '12px',
                color: '#aaa',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                userSelect: 'none',
                pointerEvents: 'none'
              }}
            >
              JUSWADRAWS COMMUNITY CANVAS
            </div>
          </div>

          {/* Submission and Download Form */}
          <div style={{ marginTop: '1.8rem' }}>
            {errorMessage && (
              <div
                style={{
                  padding: '0.8rem 1rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid var(--accent-red)',
                  color: 'var(--accent-red)',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem'
                }}
              >
                <AlertCircle size={18} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form
              onSubmit={handlePostToWall}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1rem',
                alignItems: 'end'
              }}
            >
              <div>
                <label className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                  YOUR NICKNAME (OPTIONAL):
                </label>
                <input
                  type="text"
                  placeholder="e.g. AnimeArtist99"
                  maxLength={50}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-bold)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div>
                <label className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                  SHORT NOTE / MESSAGE (OPTIONAL):
                </label>
                <input
                  type="text"
                  placeholder="Leave a message for Joshua..."
                  maxLength={140}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-bold)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              {/* Action Buttons: Download PNG & Post to Wall */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="btn-manga btn-manga-secondary"
                  style={{ flex: 1, padding: '0.75rem', fontSize: '0.95rem' }}
                >
                  <Download size={18} /> SAVE PNG
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-manga"
                  style={{ flex: 1.3, padding: '0.75rem', fontSize: '0.95rem' }}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={18} className="spinning" /> POSTING...
                    </>
                  ) : (
                    <>
                      <Send size={18} /> POST TO WALL
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ========================================================
            MODERATED COMMUNITY DOODLE WALL GALLERY
            ======================================================== */}
        <section style={{ borderTop: '2px solid var(--border-bold)', paddingTop: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-subtitle">THE HALL OF SKETCHES</div>
              <h2 className="section-title">COMMUNITY DOODLE WALL</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                Approved drawings and tags submitted by visitors and fellow artists from around the world.
              </p>
            </div>

            <button
              onClick={fetchApprovedDoodles}
              className="btn-manga-secondary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              <RefreshCw size={16} /> REFRESH WALL
            </button>
          </div>

          {isLoadingDoodles ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <RefreshCw size={36} className="spinning" style={{ margin: '0 auto 1rem', color: 'var(--accent-purple)' }} />
              <p className="font-mono">LOADING COMMUNITY DOODLES...</p>
            </div>
          ) : wallError ? (
            <div className="manga-panel" style={{ padding: '3rem', textAlign: 'center' }}>
              <AlertCircle size={40} color="var(--accent-yellow)" style={{ margin: '0 auto 1rem' }} />
              <p style={{ color: 'var(--text-secondary)' }}>{wallError}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Connect your Supabase instance to view and approve community submissions.
              </p>
            </div>
          ) : approvedDoodles.length === 0 ? (
            <div className="manga-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <Sparkles size={48} color="var(--accent-purple)" style={{ margin: '0 auto 1rem' }} />
              <h3 className="font-heading" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
                BE THE FIRST TO DOODLE!
              </h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto' }}>
                No approved doodles on the wall yet. Pick up the pen in the sketchpad above and be the first to leave your mark!
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.8rem'
              }}
            >
              {approvedDoodles.map((item) => (
                <div
                  key={item.id}
                  className="manga-panel"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ backgroundColor: '#ffffff', padding: '0.5rem' }}>
                    <img
                      src={item.image_url}
                      alt={`Doodle by ${item.nickname}`}
                      loading="lazy"
                      style={{
                        width: '100%',
                        aspectRatio: '16 / 10',
                        objectFit: 'contain'
                      }}
                    />
                  </div>

                  <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span className="font-heading" style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                        {item.nickname || 'Anonymous'}
                      </span>
                      <span className="tape-tag" style={{ fontSize: '0.6rem' }}>
                        APPROVED
                      </span>
                    </div>

                    {item.message && (
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: '1.4' }}>
                        &ldquo;{item.message}&rdquo;
                      </p>
                    )}

                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.4rem' }}>
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
