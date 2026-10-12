import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Mail, Send, CheckCircle2, AlertTriangle, RefreshCw, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { sendCommissionInquiry, isEmailJSConfigured } from '../utils/emailService';
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

  const validate = () => {
    const errors = {};
    if (!formData.clientName.trim()) {
      errors.clientName = 'Please provide your name or preferred nickname.';
    }
    if (!formData.clientEmail.trim()) {
      errors.clientEmail = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
      errors.clientEmail = 'Please enter a valid email address (e.g., name@domain.com).';
    }
    if (!formData.description.trim()) {
      errors.description = 'Please describe the character or artwork you would like Joshua to draw.';
    }
    if (formData.referenceLinks.trim()) {
      // If reference links provided, basic url pattern check
      const links = formData.referenceLinks.split('\n').filter(Boolean);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    soundFx.playSlash();
    setStatus('loading');
    setErrorMessage('');

    try {
      // 1. Deliver via EmailJS
      await sendCommissionInquiry(formData);

      // 2. Also log to Supabase inquiries table if configured
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('commission_inquiries').insert([
            {
              client_name: formData.clientName,
              client_email: formData.clientEmail,
              artwork_type: formData.artworkType,
              currency: formData.currency,
              estimated_price: formData.estimatedPrice,
              description: formData.description,
              reference_links: formData.referenceLinks,
              deadline: formData.deadline,
              additional_characters: formData.additionalCharacters,
              detailed_background: formData.detailedBackground,
              preferred_style: formData.preferredStyle,
              notes: formData.notes,
              status: 'new'
            }
          ]);
        } catch (dbErr) {
          console.warn('Inquiry saved to email but DB log skipped:', dbErr);
        }
      }

      soundFx.playSuccess();
      setStatus('success');
    } catch (err) {
      console.error('Submission failed:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Failed to submit inquiry. Please try again or email directly.');
    }
  };

  return (
    <div style={{ padding: 'clamp(2rem, 5vw, 4rem) 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div className="section-subtitle">COMMISSION INQUIRY // 05</div>
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
            className="manga-panel cut-corner"
            style={{
              padding: 'clamp(1.5rem, 4vw, 3rem)',
              backgroundColor: 'var(--bg-card)',
              border: '2px solid var(--text-primary)',
              boxShadow: '8px 8px 0px var(--accent-purple)'
            }}
          >
            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <CheckCircle2 size={64} color="#22c55e" style={{ margin: '0 auto 1.5rem' }} />
                <h2 className="font-heading" style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>
                  INQUIRY TRANSMITTED!
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6', maxWidth: '480px', margin: '0 auto 2rem' }}>
                  Thank you, <strong>{formData.clientName}</strong>! Your inquiry for a <strong>{formData.artworkType}</strong> has been sent directly to Joshua. Look out for an email response at <strong>{formData.clientEmail}</strong> within 24-48 hours.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
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
                    className="btn-manga"
                  >
                    SUBMIT ANOTHER INQUIRY
                  </button>
                  <Link to="/artworks" className="btn-manga btn-manga-secondary">
                    BROWSE ARTWORKS
                  </Link>
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
                      padding: '1rem 1.2rem',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      border: '2px solid var(--accent-red)',
                      color: 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8rem'
                    }}
                  >
                    <AlertTriangle size={24} color="var(--accent-red)" />
                    <div>
                      <strong style={{ display: 'block', color: 'var(--accent-red)' }}>Submission Error</strong>
                      <span style={{ fontSize: '0.9rem' }}>{errorMessage}</span>
                    </div>
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
                        EMAIL ADDRESS (FOR REPLY) *
                      </label>
                      <input
                        type="email"
                        placeholder="name@gmail.com"
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
                      {validationErrors.clientEmail && (
                        <span style={{ color: 'var(--accent-red)', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>
                          {validationErrors.clientEmail}
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
                      style={{ marginTop: '0.2rem', width: '18px', height: '18px', accentColor: 'var(--accent-purple)' }}
                    />
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      I agree to the <Link to="/commissions" target="_blank" style={{ color: 'var(--accent-purple)', textDecoration: 'underline' }}>commission policies</Link>: 50% downpayment before sketch phase, expected ~1 week turnaround, and balance due before final delivery.
                    </div>
                  </label>
                  {validationErrors.agreedToTerms && (
                    <span style={{ color: 'var(--accent-red)', fontSize: '0.75rem', marginTop: '0.4rem', display: 'block' }}>
                      {validationErrors.agreedToTerms}
                    </span>
                  )}
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-manga"
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
              </form>
            )}
          </div>

          {/* Right Sidebar: Direct Email & Security Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Direct Contact Card */}
            <div className="manga-panel" style={{ padding: '2rem' }}>
              <div className="section-subtitle">DIRECT EMAIL FALLBACK</div>
              <h3 className="font-heading" style={{ fontSize: '1.6rem', marginBottom: '0.8rem' }}>
                PREFER DIRECT EMAIL?
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.4rem' }}>
                If you have large ZIP archives, PDF character documents, or prefer sending directly from your email client, feel free to write to Joshua at:
              </p>
              <a
                href="mailto:joshualagare255@gmail.com"
                className="btn-manga btn-manga-secondary"
                style={{ width: '100%', padding: '0.8rem', fontSize: '0.95rem' }}
              >
                <Mail size={16} color="var(--accent-yellow)" /> joshualagare255@gmail.com
              </a>
            </div>

            {/* Turnaround & Verification Card */}
            <div className="manga-panel" style={{ padding: '2rem', backgroundColor: 'var(--bg-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <ShieldCheck size={20} color="#22c55e" />
                <h4 className="font-heading" style={{ fontSize: '1.25rem' }}>OFFICIAL VERIFICATION</h4>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <li>✓ Notification delivered directly to Joshua&apos;s verified inbox.</li>
                <li>✓ No commission is confirmed until terms & slots are accepted.</li>
                <li>✓ Payment sent only after slot agreement.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
