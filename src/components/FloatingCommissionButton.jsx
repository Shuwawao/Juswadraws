import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Paintbrush } from 'lucide-react';
import soundFx from '../utils/soundFx';

export default function FloatingCommissionButton() {
  const location = useLocation();

  // Hide on Sketch Wall to prevent blocking drawing canvas & hide on admin dashboard
  if (location.pathname.startsWith('/sketch-wall') || location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <Link
      to="/commissions"
      className="floating-commission-btn glitch-hover"
      onClick={() => soundFx.playSlash()}
      onMouseEnter={() => soundFx.playHover()}
      aria-label="Commission Joshua (JUSWADRAWS)"
    >
      <Paintbrush size={18} />
      <span>COMMISSION ME</span>
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#22c55e',
          display: 'inline-block'
        }}
      />
    </Link>
  );
}
