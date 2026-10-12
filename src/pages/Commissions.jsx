import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, ShieldAlert, Clock, CreditCard, Sparkles, AlertCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';
import soundFx from '../utils/soundFx';

export const COMMISSION_RATES = [
  {
    id: 'headshot',
    name: 'Headshot',
    phpPrice: '₱300',
    usdPrice: '$10',
    phpVal: 300,
    usdVal: 10,
    desc: 'Tight focus on facial expressions, hair detailing, and headgear/accessories.',
    tag: 'PORTRAIT'
  },
  {
    id: 'bust',
    name: 'Bust',
    phpPrice: '₱400',
    usdPrice: '$12',
    phpVal: 400,
    usdVal: 12,
    desc: 'Head and shoulders, collarbone, and upper chest costume styling.',
    tag: 'POPULAR'
  },
  {
    id: 'half_body',
    name: 'Half Body',
    phpPrice: '₱500',
    usdPrice: '$15',
    phpVal: 500,
    usdVal: 15,
    desc: 'From waist up. Great for character weapons, hand gestures, and dynamic torso poses.',
    tag: 'DYNAMIC'
  },
  {
    id: 'knee_up',
    name: 'Knee Up',
    phpPrice: '₱600',
    usdPrice: '$17',
    phpVal: 600,
    usdVal: 17,
    desc: 'Three-quarter view displaying full outfit layers, holsters, and mid-motion stance.',
    tag: 'EDITORIAL'
  },
  {
    id: 'full_body',
    name: 'Full Body',
    phpPrice: '₱800',
    usdPrice: '$20',
    phpVal: 800,
    usdVal: 20,
    desc: 'Complete head-to-toe illustration with shoes, full anatomy, and high-impact action stance.',
    tag: 'COMPLETE'
  },
  {
    id: 'character_sheet',
    name: 'Full Character Design Sheet',
    phpPrice: '₱2,500',
    usdPrice: 'Custom quote',
    phpVal: 2500,
    usdVal: null, // Custom quote
    desc: 'Comprehensive multi-view character reference sheet: front/back poses, expressions, costume breakdown, and color palette.',
    tag: 'PREMIUM OC'
  }
];

export default function Commissions() {
  const navigate = useNavigate();

  // Availability state
  const [isAvailable, setIsAvailable] = useState(true);
  const [statusNote, setStatusNote] = useState('Currently accepting new commissions! Expected turnaround ~1 week.');

  // Estimator state
  const [currency, setCurrency] = useState('PHP'); // 'PHP' or 'USD'
  const [selectedType, setSelectedType] = useState('half_body');
  const [additionalCharacters, setAdditionalCharacters] = useState(false);
  const [detailedBackground, setDetailedBackground] = useState(false);

  // Fetch live availability from Supabase
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    let isMounted = true;
    async function fetchAvailability() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'commissions_status')
          .single();

        if (!error && data && data.value && isMounted) {
          setIsAvailable(data.value.open ?? true);
          if (data.value.note) setStatusNote(data.value.note);
        }
      } catch (e) {
        console.warn('Could not load commissions status from backend:', e);
      }
    }

    fetchAvailability();
    return () => {
      isMounted = false;
    };
  }, []);

  const currentRateItem = COMMISSION_RATES.find((r) => r.id === selectedType) || COMMISSION_RATES[2];

  // Calculate estimator price label
  const isCustomQuote =
    (currency === 'USD' && currentRateItem.id === 'character_sheet') ||
    additionalCharacters ||
    detailedBackground;

  const displayedPrice = isCustomQuote
    ? 'Custom quote'
    : currency === 'PHP'
    ? currentRateItem.phpPrice
    : currentRateItem.usdPrice;

  const handleReset = () => {
    soundFx.playWhoosh();
    setSelectedType('half_body');
    setAdditionalCharacters(false);
    setDetailedBackground(false);
  };

  const handleProceedToInquiry = () => {
    soundFx.playSlash();
    // Navigate to contact inquiry form passing state
    navigate('/contact', {
      state: {
        artworkType: currentRateItem.name,
        currency,
        estimatedPrice: displayedPrice,
        additionalCharacters,
        detailedBackground
      }
    });
  };

  return (
    <div style={{ padding: 'clamp(2rem, 5vw, 4rem) 0' }}>
      <div className="container">
        {/* Header & Status Indicator */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div className="section-subtitle">COMMISSION STATION // 03</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}>
            <h1 className="section-title">COMMISSIONS & PRICING</h1>

            {/* Live Availability Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.55rem 1.2rem',
                backgroundColor: isAvailable ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                border: `2px solid ${isAvailable ? '#22c55e' : '#ef4444'}`,
                boxShadow: `3px 3px 0px ${isAvailable ? '#22c55e' : '#ef4444'}`
              }}
            >
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: isAvailable ? '#22c55e' : '#ef4444'
                }}
              />
              <span className="font-heading" style={{ fontSize: '1.1rem', color: isAvailable ? '#22c55e' : '#ef4444' }}>
                {isAvailable ? 'COMMISSIONS: OPEN' : 'COMMISSIONS: CURRENTLY CLOSED'}
              </span>
            </div>
          </div>

          <p style={{ color: 'var(--text-secondary)', marginTop: '0.8rem', fontSize: '1.05rem', maxWidth: '680px' }}>
            {statusNote}
          </p>
        </div>

        {/* Currency Toggle Switch */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            padding: '1.2rem 1.8rem',
            backgroundColor: 'var(--bg-secondary)',
            border: '2px solid var(--border-bold)',
            marginBottom: '2.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
              SELECT CURRENCY VIEW:
            </span>
            <span className="tape-tag" style={{ fontSize: '0.68rem' }}>
              OFFICIAL RATES
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => {
                setCurrency('PHP');
                soundFx.playPop();
              }}
              onMouseEnter={() => soundFx.playHover()}
              className={currency === 'PHP' ? 'btn-manga' : 'btn-manga btn-manga-secondary'}
              style={{ padding: '0.45rem 1.2rem', fontSize: '1rem' }}
            >
              PHP (₱)
            </button>
            <button
              onClick={() => {
                setCurrency('USD');
                soundFx.playPop();
              }}
              onMouseEnter={() => soundFx.playHover()}
              className={currency === 'USD' ? 'btn-manga' : 'btn-manga btn-manga-secondary'}
              style={{ padding: '0.45rem 1.2rem', fontSize: '1rem' }}
            >
              USD ($)
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.8rem',
            marginBottom: '5rem'
          }}
        >
          {COMMISSION_RATES.map((rate, rIdx) => {
            const isSelected = selectedType === rate.id;
            const price = currency === 'PHP' ? rate.phpPrice : rate.usdPrice;

            return (
              <div
                key={rate.id}
                className="manga-panel commission-card-entry"
                style={{
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: isSelected ? '2px solid var(--accent-purple)' : '1px solid var(--border-color)',
                  boxShadow: isSelected ? '6px 6px 0px var(--accent-purple)' : 'var(--shadow-pop)',
                  position: 'relative',
                  backgroundColor: 'var(--bg-card)',
                  animationDelay: `${rIdx * 0.08}s`
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span className="tape-tag" style={{ fontSize: '0.68rem' }}>
                      {rate.tag}
                    </span>
                    <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      TIER
                    </span>
                  </div>

                  <h3 className="font-heading" style={{ fontSize: '1.8rem', letterSpacing: '0.04em', color: 'var(--text-primary)' }}>
                    {rate.name}
                  </h3>

                  {/* Exact Price */}
                  <div style={{ margin: '1rem 0' }}>
                    <span
                      className="font-heading"
                      style={{
                        fontSize: price.includes('Custom') ? '2rem' : '2.8rem',
                        color: 'var(--accent-yellow)',
                        lineHeight: 1
                      }}
                    >
                      {price}
                    </span>
                    <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {currency === 'PHP' ? 'Philippine Peso' : 'US Dollar (Fixed Rate)'}
                    </div>
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    {rate.desc}
                  </p>
                </div>

                <div style={{ marginTop: '2rem', borderTop: '1px dashed var(--border-color)', paddingTop: '1rem' }}>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedType(rate.id);
                      const estimatorEl = document.getElementById('price-estimator');
                      if (estimatorEl) estimatorEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    onMouseEnter={() => soundFx.playHover()}
                    className={isSelected ? 'btn-manga' : 'btn-manga btn-manga-secondary'}
                    style={{ width: '100%', fontSize: '0.95rem', padding: '0.6rem' }}
                  >
                    {isSelected ? '✓ SELECTED IN ESTIMATOR' : 'SELECT & ESTIMATE'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================
            INTERACTIVE PRICE ESTIMATOR
            ======================================================== */}
        <section
          id="price-estimator"
          className="manga-panel cut-corner"
          style={{
            padding: 'clamp(2rem, 5vw, 3.5rem)',
            backgroundColor: 'var(--bg-secondary)',
            border: '2px solid var(--text-primary)',
            boxShadow: '8px 8px 0px var(--accent-purple)',
            marginBottom: '5rem'
          }}
        >
          <div style={{ marginBottom: '2rem' }}>
            <div className="section-subtitle">CONFIGURATOR // REAL-TIME</div>
            <h2 className="font-heading" style={{ fontSize: '2.5rem' }}>
              INTERACTIVE COMMISSION ESTIMATOR
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Configure your commission details below. Selections will automatically transfer to the inquiry form!
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2.5rem',
              alignItems: 'start'
            }}
          >
            {/* Options Selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
              {/* Artwork Type Select */}
              <div>
                <label className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
                  1. ARTWORK TYPE:
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    soundFx.playTab();
                  }}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    backgroundColor: 'var(--bg-card)',
                    border: '2px solid var(--border-bold)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '1rem',
                    boxShadow: '3px 3px 0px var(--border-color)'
                  }}
                >
                  {COMMISSION_RATES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} — {currency === 'PHP' ? r.phpPrice : r.usdPrice}
                    </option>
                  ))}
                </select>
              </div>

              {/* Addons Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                  2. ADDITIONAL COMPLEXITY:
                </span>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={additionalCharacters}
                    onChange={(e) => {
                      setAdditionalCharacters(e.target.checked);
                      soundFx.playPop();
                    }}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--accent-purple)' }}
                  />
                  <div>
                    <span style={{ fontWeight: 600 }}>Additional Characters (+1 or more)</span>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Requires custom quote based on character complexity
                    </div>
                  </div>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={detailedBackground}
                    onChange={(e) => {
                      setDetailedBackground(e.target.checked);
                      soundFx.playPop();
                    }}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--accent-purple)' }}
                  />
                  <div>
                    <span style={{ fontWeight: 600 }}>Detailed Scenic Background / Architecture</span>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Requires custom quote (simple/graphic backdrops are free!)
                    </div>
                  </div>
                </label>
              </div>

              <button
                onClick={handleReset}
                onMouseEnter={() => soundFx.playHover()}
                className="btn-manga-secondary"
                style={{ alignSelf: 'flex-start', padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <RotateCcw size={14} /> RESET SELECTIONS
              </button>
            </div>

            {/* Live Summary Panel */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '2px solid var(--text-primary)',
                padding: '2rem',
                boxShadow: '6px 6px 0px var(--border-bold)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.2rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="tape-tag" style={{ background: 'var(--accent-yellow-tape)', color: '#000' }}>
                  ESTIMATION SUMMARY
                </span>
                <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  CURRENCY: {currency}
                </span>
              </div>

              <div style={{ borderBottom: '1px dashed var(--border-color)', paddingBottom: '1rem' }}>
                <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  SELECTED TIER:
                </span>
                <div className="font-heading" style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>
                  {currentRateItem.name}
                </div>
              </div>

              <div>
                <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  ESTIMATED RATE:
                </span>
                <div
                  className="font-heading"
                  style={{
                    fontSize: displayedPrice.includes('Custom') ? '2.4rem' : '3.4rem',
                    color: 'var(--accent-purple)',
                    lineHeight: 1,
                    marginTop: '0.3rem'
                  }}
                >
                  {displayedPrice}
                </div>

                {isCustomQuote && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginTop: '0.8rem',
                      fontSize: '0.85rem',
                      color: 'var(--accent-yellow)',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    <AlertCircle size={16} />
                    <span>Selected add-on requires Joshua&apos;s custom review.</span>
                  </div>
                )}
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                * Final pricing is confirmed by the artist upon review of character complexity and reference materials.
              </p>

              <button
                onClick={handleProceedToInquiry}
                className="btn-manga"
                style={{ width: '100%', padding: '1rem', fontSize: '1.15rem' }}
              >
                REQUEST A COMMISSION <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================
            COMMISSION POLICIES & TERMS
            ======================================================== */}
        <section style={{ borderTop: '2px solid var(--border-bold)', paddingTop: '4rem' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <div className="section-subtitle">TRANSPARENCY & TERMS</div>
            <h2 className="section-title">COMMISSION POLICIES</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.8rem'
            }}
          >
            {/* Policy 1 */}
            <div className="manga-panel" style={{ padding: '1.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <Sparkles size={22} color="var(--accent-purple)" />
                <h3 className="font-heading" style={{ fontSize: '1.4rem' }}>ART STYLES</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                I am versatile and can work across multiple illustration styles—especially <strong>My Hero Academia (MHA)</strong> inspired kinetic hero styles, <strong>Gachiakuta</strong> gritty lineart, and original character (OC) designs.
              </p>
            </div>

            {/* Policy 2 */}
            <div className="manga-panel" style={{ padding: '1.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <CreditCard size={22} color="var(--accent-yellow)" />
                <h3 className="font-heading" style={{ fontSize: '1.4rem' }}>PAYMENT METHODS</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                I accept payments via <strong>GCash</strong> (for Philippine clients in PHP) and <strong>PayPal</strong> (for international clients in USD). Payment instructions will be sent via email upon project confirmation.
              </p>
            </div>

            {/* Policy 3 */}
            <div className="manga-panel" style={{ padding: '1.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <ShieldAlert size={22} color="var(--accent-red)" />
                <h3 className="font-heading" style={{ fontSize: '1.4rem' }}>PAYMENT PROCESS</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                <strong>50% downpayment</strong> is required before any sketching begins. Once the sketch is approved and the final high-resolution piece is rendered, the remaining <strong>50% balance</strong> is due before delivery.
              </p>
            </div>

            {/* Policy 4 */}
            <div className="manga-panel" style={{ padding: '1.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <Clock size={22} color="var(--accent-cyan)" />
                <h3 className="font-heading" style={{ fontSize: '1.4rem' }}>TURNAROUND TIME</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Expected turnaround time is approximately <strong>one week</strong> per piece. Please note that this is the expected timeframe, not an absolute guarantee regardless of complexity, queue volume, or scheduling.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
