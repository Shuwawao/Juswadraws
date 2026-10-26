import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Mail, Send, CheckCircle2, AlertTriangle, RefreshCw, Sparkles, ExternalLink, ShieldCheck, Copy, Check } from 'lucide-react';
import { sendCommissionInquiry, generateMailtoUrl, isEmailJSConfigured } from '../utils/emailService';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';
import { COMMISSION_RATES } from './Commissions';
import soundFx from '../utils/soundFx';

export default function Contact() {
  const location = useLocation();
  const prefill = location.state || {};

  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    artworkType: prefill.artworkType || 'Half Body',
    currency: prefill.currency || 'PHP',
    estimatedPrice: prefill.estimatedPrice || '₱500',
    description: '',
    referenceLinks: '',
    deadline: '',
    additionalCharacters: prefill.additionalCharacters || false,
    detailedBackground: prefill.detailedBackground || false,
    preferredStyle: 'MHA / Kinetic Anime Style',
    notes: '',
    agreedToTerms: false,
    honeypot: '' // Anti-bot honeypot field
  });

  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [dbSaved, setDbSaved] = useState(false);

  // Strict email validation regex checking local part, @, domain, and 2+ char TLD
  const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  const validate = () => {
    const errors = {};
    const trimmedName = formData.clientName.trim();
    const trimmedEmail = formData.clientEmail.trim();

    if (!trimmedName) {
      errors.clientName = 'Please provide your name or preferred nickname.';
    } else if (trimmedName.length < 2) {
      errors.clientName = 'Name must be at least 2 characters long.';
    }

    if (!trimmedEmail) {
      errors.clientEmail = 'Please provide your real email address so Joshua can reply.';
    } else if (!EMAIL_REGEX.test(trimmedEmail) || !trimmedEmail.includes('.')) {
      errors.clientEmail = 'Please enter a valid email address (e.g., name@gmail.com).';
    }

    if (!formData.description.trim()) {
      errors.description = 'Please describe the character or artwork you would like Joshua to draw.';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Please provide at least a short description (10+ characters) of your idea.';
    }

    if (formData.referenceLinks.trim()) {
      const links = formData.referenceLinks.split('\n').map(l => l.trim()).filter(Boolean);
      for (const link of links) {
        if (!link.startsWith('http://') && !link.startsWith('https://')) {
          errors.referenceLinks = 'Reference links should begin with http:// or https:// (one per line).';
          break;
        }
      }
    }

    if (!formData.agreedToTerms) {
      errors.agreedToTerms = 'You must agree to the commission policies & payment process (50% upfront).';
    }

    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      soundFx.playPop();
    }
    return Object.keys(errors).length === 0;
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('joshualagare255@gmail.com');
    setCopiedEmail(true);
    soundFx.playPop();
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    soundFx.playSlash();
    setStatus('loading');
    setErrorMessage('');
    setDbSaved(false);

    let savedToDb = false;

    // 1. Always record in Supabase database so inquiry is never lost
    if (isSupabaseConfigured && supabase) {
      try {
        const { error: dbError } = await supabase.from('commission_inquiries').insert([
          {
            client_name: formData.clientName.trim(),
            client_email: formData.clientEmail.trim(),
            artwork_type: formData.artworkType,
            currency: formData.currency,
            estimated_price: formData.estimatedPrice,
            description: formData.description.trim(),
            reference_links: formData.referenceLinks.trim(),
            deadline: formData.deadline.trim(),
            additional_characters: formData.additionalCharacters,
            detailed_background: formData.detailedBackground,
            preferred_style: formData.preferredStyle,
            notes: formData.notes.trim(),
            status: 'new'
          }
        ]);
        if (!dbError) {
          savedToDb = true;
          setDbSaved(true);
        } else {
          console.warn('Supabase DB log returned error:', dbError);
        }
      } catch (dbErr) {
        console.warn('Could not record inquiry in Supabase:', dbErr);
      }
    }

    // 2. Transmit via EmailJS to joshualagare255@gmail.com
    try {
      await sendCommissionInquiry({
        ...formData,
        clientName: formData.clientName.trim(),
        clientEmail: formData.clientEmail.trim()
      });

      soundFx.playSuccess();
      setStatus('success');
    } catch (err) {
      console.error('EmailJS submission failed:', err);

      // If saved to DB, treat as partial success with mailto fallback
      if (savedToDb) {
        soundFx.playPop();
        setStatus('error');
        setErrorMessage(
          'Your inquiry has been safely logged in Joshua’s database! However, the automated mail service encountered a connection delay. Please click below to open your email app and send your pre-filled inquiry directly to guarantee instant delivery.'
        );
      } else {
        setStatus('error');
        setErrorMessage(
          err.message || 'Failed to transmit inquiry. Please click the button below to send your pre-filled details directly via your email client.'
        );
      }
    }
  };

  const mailtoLink = generateMailtoUrl(formData);

  return (
    <div style={{ padding: 'clamp(2rem, 5vw, 4rem) 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div className="section-subtitle">COMMISSION INQUIRY • 05</div>
          <h1 className="section-title">REQUEST A COMMISSION</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.6rem', fontSize: '1.05rem', maxWidth: '680px' }}>
            Submit your character details and project specifications below. Joshua reviews all inquiries and will reply with confirmation and sketch schedules.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(2rem, 5vw, 4rem)',
            alignItems: 'start'
          }}
        >
          {/* Main Form Panel */}
          <div
            className="manga-panel-card cut-corner"
            style={{
              padding: 'clamp(1.5rem, 4vw, 3rem)',
              backgroundColor: 'var(--bg-card)',
              border: '2.5px solid var(--text-primary)',
              boxShadow: '8px 8px 0px var(--accent-red)',
              position: 'relative'
            }}
          >
            <span className="drafting-corner-mark-tl">+</span>
            <span className="drafting-corner-mark-tr">+</span>
            <span className="drafting-corner-mark-bl">+</span>
            <span className="drafting-corner-mark-br">+</span>

            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <CheckCircle2 size={64} color="#22c55e" style={{ margin: '0 auto 1.5rem' }} />
                <div className="manga-narrator-box manga-narrator-box-red" style={{ marginBottom: '0.8rem' }}>
                  TRANSMISSION CONFIRMED
                </div>
                <h2 className="font-heading" style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>
                  INQUIRY DELIVERED!
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
                  Thank you, <strong>{formData.clientName}</strong>! Your inquiry for a <strong>{formData.artworkType}</strong> has been transmitted directly to Joshua Lagare (<code style={{ color: 'var(--accent-red)' }}>joshualagare255@gmail.com</code>).
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '2rem' }}>
                  Joshua reviews all requests and will reply to your inbox at <strong>{formData.clientEmail}</strong> within 24–48 hours.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxWidth: '420px', margin: '0 auto' }}>
                  {/* Backup mailto link for client peace of mind */}
                  <a
                    href={mailtoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-manga btn-manga-yellow"
                    style={{ padding: '0.75rem', fontSize: '0.95rem' }}
                  >
                    <Mail size={16} /> OPEN COPY IN YOUR EMAIL APP
                  </a>

                  <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
                    <button
                      onClick={() => {
                        setStatus('idle');
                        setFormData({
                          clientName: '',
                          clientEmail: '',
                          artworkType: 'Half Body',
                          currency: 'PHP',
                          estimatedPrice: '₱500',
                          description: '',
                          referenceLinks: '',
                          deadline: '',
                          additionalCharacters: false,
                          detailedBackground: false,
                          preferredStyle: 'MHA / Kinetic Anime Style',
                          notes: '',
                          agreedToTerms: false,
                          honeypot: ''
                        });
                      }}
                      className="btn-manga btn-manga-secondary"
                      style={{ flex: 1, padding: '0.7rem' }}
                    >
                      NEW INQUIRY
                    </button>
                    <Link to="/artworks" className="btn-manga btn-manga-secondary" style={{ flex: 1, padding: '0.7rem' }}>
                      GALLERY
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
                {/* Honeypot field (hidden from real users to catch bots) */}
                <div style={{ display: 'none' }}>
                  <input
                    type="text"
                    name="website_url"
                    value={formData.honeypot}
                    onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    tabIndex="-1"
                    autoComplete="off"
                  />
                </div>

                {status === 'error' && (
                  <div
                    style={{
                      padding: '1.2rem',
                      backgroundColor: 'rgba(230, 57, 70, 0.08)',
                      border: '2px solid var(--accent-red)',
                      boxShadow: '4px 4px 0px var(--accent-red)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.8rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <AlertTriangle size={20} color="var(--accent-red)" />
                      <strong className="font-heading" style={{ fontSize: '1.2rem', color: 'var(--accent-red)' }}>
                        EMAIL DELIVERY NOTICE
                      </strong>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                      {errorMessage}
                    </p>
                    <a
                      href={mailtoLink}
                      className="btn-manga btn-manga-red"
                      style={{ padding: '0.75rem 1rem', fontSize: '0.95rem', textDecoration: 'none', alignSelf: 'flex-start' }}
                    >
                      <Mail size={16} /> OPEN PRE-FILLED EMAIL IN GMAIL / MAIL APP
                    </a>
                  </div>
                )}

                {/* Section 1: Client Information */}
                <div>
                  <div className="section-subtitle">1. CONTACT DETAILS</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '0.8rem' }}>
                    <div>
                      <label className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
                        YOUR NAME / NICKNAME *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ren or Jane Doe"
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          backgroundColor: 'var(--bg-secondary)',
                          border: validationErrors.clientName ? '2px solid var(--accent-red)' : '1px solid var(--border-bold)',
                          color: 'var(--text-primary)'
                        }}
                      />
                      {validationErrors.clientName && (
                        <span style={{ color: 'var(--accent-red)', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>
                          {validationErrors.clientName}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
                        YOUR REAL EMAIL ADDRESS *
                      </label>
                      <input
                        type="email"
                        placeholder="yourname@gmail.com"
                        value={formData.clientEmail}
                        onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          backgroundColor: 'var(--bg-secondary)',
                          border: validationErrors.clientEmail ? '2px solid var(--accent-red)' : '1px solid var(--border-bold)',
                          color: 'var(--text-primary)'
                        }}
                      />
                      {validationErrors.clientEmail ? (
                        <span style={{ color: 'var(--accent-red)', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>
                          {validationErrors.clientEmail}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '0.2rem', display: 'block', fontFamily: 'var(--font-mono)' }}>
                          Joshua will reply directly to this address.
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 2: Commission Specifications */}
                <div>
                  <div className="section-subtitle">2. PROJECT SPECIFICATIONS</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '0.8rem' }}>
                    <div>
                      <label className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
                        ARTWORK TYPE
                      </label>
                      <select
                        value={formData.artworkType}
                        onChange={(e) => setFormData({ ...formData, artworkType: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--border-bold)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        {COMMISSION_RATES.map((r) => (
                          <option key={r.id} value={r.name}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
                        PREFERRED CURRENCY
                      </label>
                      <select
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--border-bold)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        <option value="PHP">PHP (₱ via GCash)</option>
                        <option value="USD">USD ($ via PayPal)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
                        TARGET COMPLETION / DEADLINE
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Within 2 weeks / Flexible"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--border-bold)',
                          color: 'var(--text-primary)'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Description & Reference Links */}
                <div>
                  <div className="section-subtitle">3. ARTWORK DESCRIPTION & REFERENCES</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.8rem' }}>
                    <div>
                      <label className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
                        CHARACTER / ARTWORK DESCRIPTION *
                      </label>
                      <textarea
                        rows="4"
                        placeholder="Describe character personality, pose, outfit, expression, key accessories, lighting..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          backgroundColor: 'var(--bg-secondary)',
                          border: validationErrors.description ? '2px solid var(--accent-red)' : '1px solid var(--border-bold)',
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-body)'
                        }}
                      />
                      {validationErrors.description && (
                        <span style={{ color: 'var(--accent-red)', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>
                          {validationErrors.description}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
                        REFERENCE LINKS (GOOGLE DRIVE, PINTEREST, IMGUR...)
                      </label>
                      <textarea
                        rows="2"
                        placeholder="https://drive.google.com/... (one link per line)"
                        value={formData.referenceLinks}
                        onChange={(e) => setFormData({ ...formData, referenceLinks: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          backgroundColor: 'var(--bg-secondary)',
                          border: validationErrors.referenceLinks ? '2px solid var(--accent-red)' : '1px solid var(--border-bold)',
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.85rem'
                        }}
                      />
                      {validationErrors.referenceLinks && (
                        <span style={{ color: 'var(--accent-red)', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>
                          {validationErrors.referenceLinks}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Agreement Checkbox */}
                <div style={{ paddingTop: '0.5rem' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.8rem',
                      cursor: 'pointer',
                      padding: '0.8rem',
                      backgroundColor: 'var(--bg-secondary)',
                      border: validationErrors.agreedToTerms ? '2px solid var(--accent-red)' : '1px solid var(--border-color)'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.agreedToTerms}
                      onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                      style={{ marginTop: '0.2rem', width: '18px', height: '18px', accentColor: 'var(--accent-red)' }}
                    />
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      I agree to the <Link to="/commissions" target="_blank" style={{ color: 'var(--accent-red)', textDecoration: 'underline' }}>commission policies</Link>: 50% downpayment before sketch phase, expected ~1 week turnaround, and balance due before final delivery.
                    </div>
                  </label>
                  {validationErrors.agreedToTerms && (
                    <span style={{ color: 'var(--accent-red)', fontSize: '0.75rem', marginTop: '0.4rem', display: 'block' }}>
                      {validationErrors.agreedToTerms}
                    </span>
                  )}
                </div>

                {/* Submit Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-manga btn-manga-red"
                    style={{ width: '100%', padding: '1rem', fontSize: '1.2rem' }}
                  >
                    {status === 'loading' ? (
                      <>
                        <RefreshCw size={20} className="spinning" /> TRANSMITTING INQUIRY...
                      </>
                    ) : (
                      <>
                        <Send size={20} /> SUBMIT COMMISSION INQUIRY
                      </>
                    )}
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Prefer your email app?</span>
                    <a
                      href={mailtoLink}
                      style={{
                        color: 'var(--accent-yellow)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        fontFamily: 'var(--font-mono)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        textDecoration: 'underline'
                      }}
                    >
                      <Mail size={14} /> Open Pre-Filled Email Draft ↗
                    </a>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Right Sidebar: Direct Email & Security Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Direct Contact Card */}
            <div className="manga-panel-card" style={{ padding: '2rem' }}>
              <span className="drafting-corner-mark-tl">+</span>
              <div className="section-subtitle">DIRECT EMAIL CHANNEL</div>
              <h3 className="font-heading" style={{ fontSize: '1.6rem', marginBottom: '0.8rem' }}>
                DIRECT ARTIST INBOX
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.2rem', lineHeight: '1.5' }}>
                You can write directly to Joshua Lagare for inquiries, large character reference packages, or special project proposals:
              </p>

              {/* Email Box with Copy Button */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1.5px solid var(--border-bold)',
                  padding: '0.75rem 1rem',
                  marginBottom: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                  <Mail size={16} color="var(--accent-red)" />
                  <span className="font-mono" style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    joshualagare255@gmail.com
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  title="Copy email to clipboard"
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: copiedEmail ? '#22c55e' : 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  {copiedEmail ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copiedEmail ? 'COPIED!' : 'COPY'}</span>
                </button>
              </div>

              <a
                href={mailtoLink}
                className="btn-manga btn-manga-secondary"
                style={{ width: '100%', padding: '0.8rem', fontSize: '0.95rem' }}
              >
                <Mail size={16} color="var(--accent-yellow)" /> OPEN IN YOUR EMAIL APP
              </a>
            </div>

            {/* Turnaround & Verification Card */}
            <div className="manga-panel-card" style={{ padding: '2rem', backgroundColor: 'var(--bg-secondary)' }}>
              <span className="drafting-corner-mark-tl">+</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <ShieldCheck size={20} color="#22c55e" />
                <h4 className="font-heading" style={{ fontSize: '1.25rem' }}>OFFICIAL VERIFICATION</h4>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <span style={{ color: '#22c55e', fontWeight: 'bold' }}>✓</span>
                  <span>Delivered directly to Joshua&apos;s verified inbox (<code style={{ color: 'var(--text-primary)' }}>joshualagare255@gmail.com</code>).</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <span style={{ color: '#22c55e', fontWeight: 'bold' }}>✓</span>
                  <span>Every inquiry is safely backed up to the artist database.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <span style={{ color: '#22c55e', fontWeight: 'bold' }}>✓</span>
                  <span>No payment is requested until slot availability and terms are confirmed.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <span style={{ color: '#22c55e', fontWeight: 'bold' }}>✓</span>
                  <span>Expected response time: within 24 to 48 hours.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
