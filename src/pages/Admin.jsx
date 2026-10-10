import React, { useState, useEffect, useCallback } from 'react';
import {
  Lock,
  LogOut,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  EyeOff,
  Star,
  RefreshCw,
  Plus,
  Shield,
  Palette,
  MessageSquare,
  DollarSign,
  Settings,
  AlertTriangle,
  Upload,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

export default function Admin() {
  const { user, loading, signIn, signOut, isConfigured } = useAuth();

  // Sign In Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState('doodles'); // 'doodles' | 'inquiries' | 'artworks' | 'availability' | 'system'

  // 1. Doodle Moderation State
  const [doodles, setDoodles] = useState([]);
  const [doodleFilter, setDoodleFilter] = useState('pending'); // 'pending' | 'approved' | 'rejected' | 'all'
  const [loadingDoodles, setLoadingDoodles] = useState(false);

  // 2. Commission Inquiries State
  const [inquiries, setInquiries] = useState([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  // 3. Managed Artworks State
  const [artworks, setArtworks] = useState([]);
  const [loadingArtworks, setLoadingArtworks] = useState(false);
  const [newArt, setNewArt] = useState({
    title: '',
    category: 'personal-works',
    description: '',
    image_url: '',
    featured: false,
    visible: true
  });
  const [uploadingArt, setUploadingArt] = useState(false);

  // 4. Availability Controls State
  const [commissionsOpen, setCommissionsOpen] = useState(true);
  const [availabilityNote, setAvailabilityNote] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // -------------------------------------------------------------
  // Data Fetchers
  // -------------------------------------------------------------
  const fetchDoodles = useCallback(async () => {
    if (!supabase || !user) return;
    try {
      setLoadingDoodles(true);
      const query = supabase.from('doodles').select('*').order('created_at', { ascending: false });
      if (doodleFilter !== 'all') {
        query.eq('status', doodleFilter);
      }
      const { data, error } = await query;
      if (!error && data) setDoodles(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDoodles(false);
    }
  }, [user, doodleFilter]);

  const fetchInquiries = useCallback(async () => {
    if (!supabase || !user) return;
    try {
      setLoadingInquiries(true);
      const { data, error } = await supabase
        .from('commission_inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setInquiries(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingInquiries(false);
    }
  }, [user]);

  const fetchArtworks = useCallback(async () => {
    if (!supabase || !user) return;
    try {
      setLoadingArtworks(true);
      const { data, error } = await supabase.from('artworks').select('*').order('sort_order', { ascending: true });
      if (!error && data) setArtworks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingArtworks(false);
    }
  }, [user]);

  const fetchSettings = useCallback(async () => {
    if (!supabase) return;
    try {
      const { data } = await supabase.from('site_settings').select('value').eq('key', 'commissions_status').single();
      if (data && data.value) {
        setCommissionsOpen(data.value.open ?? true);
        setAvailabilityNote(data.value.note ?? '');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchDoodles();
      fetchInquiries();
      fetchArtworks();
      fetchSettings();
    }
  }, [user, fetchDoodles, fetchInquiries, fetchArtworks, fetchSettings]);

  // -------------------------------------------------------------
  // Auth Handlers
  // -------------------------------------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      await signIn(email, password);
    } catch (err) {
      setAuthError(err.message || 'Invalid credentials or login failure.');
    } finally {
      setAuthLoading(false);
    }
  };

  // -------------------------------------------------------------
  // Moderation Handlers
  // -------------------------------------------------------------
  const updateDoodleStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('doodles')
        .update({ status, approved_at: status === 'approved' ? new Date().toISOString() : null })
        .eq('id', id);
      if (error) throw error;
      fetchDoodles();
    } catch (err) {
      alert('Error updating doodle: ' + err.message);
    }
  };

  const deleteDoodle = async (id) => {
    if (!window.confirm('Permanently delete this doodle?')) return;
    try {
      const { error } = await supabase.from('doodles').delete().eq('id', id);
      if (error) throw error;
      fetchDoodles();
    } catch (err) {
      alert('Error deleting doodle: ' + err.message);
    }
  };

  // -------------------------------------------------------------
  // Inquiry Status Handler
  // -------------------------------------------------------------
  const updateInquiryStatus = async (id, status) => {
    try {
      const { error } = await supabase.from('commission_inquiries').update({ status }).eq('id', id);
      if (error) throw error;
      fetchInquiries();
    } catch (err) {
      alert('Error updating inquiry: ' + err.message);
    }
  };

  // -------------------------------------------------------------
  // Artwork Management Handlers
  // -------------------------------------------------------------
  const handleArtworkFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingArt(true);
      const ext = file.name.split('.').pop();
      const fileName = `artwork-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('artworks').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('artworks').getPublicUrl(fileName);
      setNewArt({ ...newArt, image_url: publicUrl });
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingArt(false);
    }
  };

  const handleAddArtwork = async (e) => {
    e.preventDefault();
    if (!newArt.title || !newArt.image_url) {
      alert('Title and Image are required.');
      return;
    }

    try {
      const { error } = await supabase.from('artworks').insert([newArt]);
      if (error) throw error;
      setNewArt({
        title: '',
        category: 'personal-works',
        description: '',
        image_url: '',
        featured: false,
        visible: true
      });
      fetchArtworks();
    } catch (err) {
      alert('Failed to add artwork: ' + err.message);
    }
  };

  const deleteArtwork = async (id) => {
    if (!window.confirm('Delete this managed artwork entry?')) return;
    try {
      const { error } = await supabase.from('artworks').delete().eq('id', id);
      if (error) throw error;
      fetchArtworks();
    } catch (err) {
      alert('Failed to delete artwork: ' + err.message);
    }
  };

  // -------------------------------------------------------------
  // Settings Handler
  // -------------------------------------------------------------
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess(false);

    try {
      const { error } = await supabase.from('site_settings').upsert({
        key: 'commissions_status',
        value: {
          open: commissionsOpen,
          note: availabilityNote
        },
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save settings: ' + err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  // Loading Screen
  if (loading) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center' }}>
        <RefreshCw size={36} className="spinning" style={{ margin: '0 auto 1rem', color: 'var(--accent-purple)' }} />
        <p className="font-mono">VERIFYING ADMIN SESSION...</p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Unauthenticated: Sign-in Interface
  // -------------------------------------------------------------
  if (!user) {
    return (
      <div style={{ padding: 'clamp(3rem, 6vw, 6rem) 0' }}>
        <div className="container" style={{ maxWidth: '480px' }}>
          <div
            className="manga-panel cut-corner"
            style={{
              padding: '2.5rem',
              backgroundColor: 'var(--bg-card)',
              border: '2px solid var(--text-primary)',
              boxShadow: '8px 8px 0px var(--accent-purple)'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '2px solid var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}
              >
                <Lock size={26} color="var(--accent-purple)" />
              </div>
              <h1 className="font-heading" style={{ fontSize: '2.2rem' }}>
                ARTIST DASHBOARD
              </h1>
              <span className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                RESTRICTED // JUSWADRAWS ADMIN
              </span>
            </div>

            {authError && (
              <div
                style={{
                  padding: '0.8rem 1rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid var(--accent-red)',
                  color: 'var(--accent-red)',
                  fontSize: '0.88rem',
                  marginBottom: '1.2rem'
                }}
              >
                {authError}
              </div>
            )}

            {!isConfigured && (
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid var(--accent-yellow)',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem',
                  marginBottom: '1.4rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-yellow)', fontWeight: 700, marginBottom: '0.2rem' }}>
                  <AlertTriangle size={16} /> SUPABASE SETUP REQUIRED
                </div>
                Configure <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in your environment variables to enable authentication.
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
                  ADMIN EMAIL
                </label>
                <input
                  type="email"
                  placeholder="joshualagare255@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-bold)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div>
                <label className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
                  PASSWORD
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-bold)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="btn-manga"
                style={{ width: '100%', padding: '0.9rem', marginTop: '0.5rem' }}
              >
                {authLoading ? 'AUTHENTICATING...' : 'ENTER DASHBOARD'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Authenticated Admin Dashboard
  // -------------------------------------------------------------
  return (
    <div style={{ padding: 'clamp(2rem, 5vw, 4rem) 0' }}>
      <div className="container">
        {/* Top Admin Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            paddingBottom: '2rem',
            borderBottom: '2px solid var(--border-bold)',
            marginBottom: '2.5rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className="tape-tag tape-tag-purple">ADMINISTRATOR</span>
              <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {user.email}
              </span>
            </div>
            <h1 className="font-heading" style={{ fontSize: '2.5rem', marginTop: '0.3rem' }}>
              JUSWADRAWS STUDIO COMMAND
            </h1>
          </div>

          <button onClick={signOut} className="btn-manga btn-manga-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
            <LogOut size={16} /> SIGN OUT
          </button>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '2.5rem' }}>
          <button
            onClick={() => setActiveTab('doodles')}
            className={activeTab === 'doodles' ? 'btn-manga' : 'btn-manga btn-manga-secondary'}
            style={{ padding: '0.55rem 1.2rem', fontSize: '0.9rem' }}
          >
            <Palette size={16} /> DOODLE MODERATION
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={activeTab === 'inquiries' ? 'btn-manga' : 'btn-manga btn-manga-secondary'}
            style={{ padding: '0.55rem 1.2rem', fontSize: '0.9rem' }}
          >
            <MessageSquare size={16} /> COMMISSION INQUIRIES
          </button>

          <button
            onClick={() => setActiveTab('artworks')}
            className={activeTab === 'artworks' ? 'btn-manga' : 'btn-manga btn-manga-secondary'}
            style={{ padding: '0.55rem 1.2rem', fontSize: '0.9rem' }}
          >
            <Eye size={16} /> ARTWORK MANAGER
          </button>

          <button
            onClick={() => setActiveTab('availability')}
            className={activeTab === 'availability' ? 'btn-manga' : 'btn-manga btn-manga-secondary'}
            style={{ padding: '0.55rem 1.2rem', fontSize: '0.9rem' }}
          >
            <DollarSign size={16} /> COMMISSION AVAILABILITY
          </button>
        </div>

        {/* ========================================================
            TAB 1: DOODLE MODERATION
            ======================================================== */}
        {activeTab === 'doodles' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['pending', 'approved', 'rejected', 'all'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setDoodleFilter(filter)}
                    className={doodleFilter === filter ? 'btn-manga' : 'btn-manga btn-manga-secondary'}
                    style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem', textTransform: 'uppercase' }}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <button onClick={fetchDoodles} className="btn-manga-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                <RefreshCw size={14} /> REFRESH
              </button>
            </div>

            {loadingDoodles ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <RefreshCw size={28} className="spinning" style={{ margin: '0 auto', color: 'var(--accent-purple)' }} />
              </div>
            ) : doodles.length === 0 ? (
              <div className="manga-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No doodles found for filter &ldquo;{doodleFilter}&rdquo;.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {doodles.map((item) => (
                  <div key={item.id} className="manga-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <div style={{ backgroundColor: '#fff', border: '1px solid #ccc' }}>
                      <img src={item.image_url} alt={item.nickname} style={{ width: '100%', aspectRatio: '16/10', objectFit: 'contain' }} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong className="font-heading" style={{ fontSize: '1.2rem' }}>{item.nickname}</strong>
                        <span className={`tape-tag ${item.status === 'approved' ? '' : item.status === 'rejected' ? 'tape-tag-red' : 'tape-tag-purple'}`}>
                          {item.status.toUpperCase()}
                        </span>
                      </div>
                      {item.message && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>&ldquo;{item.message}&rdquo;</p>}
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.4rem' }}>
                        Submitted: {new Date(item.created_at).toLocaleString()}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', borderTop: '1px dashed var(--border-color)', paddingTop: '0.6rem' }}>
                      {item.status !== 'approved' && (
                        <button
                          onClick={() => updateDoodleStatus(item.id, 'approved')}
                          className="btn-manga"
                          style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem', backgroundColor: '#22c55e', borderColor: '#22c55e' }}
                        >
                          <CheckCircle2 size={14} /> APPROVE
                        </button>
                      )}
                      {item.status !== 'rejected' && (
                        <button
                          onClick={() => updateDoodleStatus(item.id, 'rejected')}
                          className="btn-manga-secondary"
                          style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem', color: 'var(--accent-red)' }}
                        >
                          <XCircle size={14} /> REJECT
                        </button>
                      )}
                      <button
                        onClick={() => deleteDoodle(item.id)}
                        className="btn-manga-secondary"
                        style={{ padding: '0.4rem', color: 'var(--text-muted)' }}
                        title="Delete permanently"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 2: COMMISSION INQUIRIES
            ======================================================== */}
        {activeTab === 'inquiries' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div className="section-subtitle">LOGGED INQUIRIES ({inquiries.length})</div>
              <button onClick={fetchInquiries} className="btn-manga-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                <RefreshCw size={14} /> REFRESH
              </button>
            </div>

            {loadingInquiries ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <RefreshCw size={28} className="spinning" style={{ margin: '0 auto', color: 'var(--accent-purple)' }} />
              </div>
            ) : inquiries.length === 0 ? (
              <div className="manga-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No commission inquiries logged in the database yet. New inquiries submitted via the form will appear here.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {inquiries.map((inq) => (
                  <div key={inq.id} className="manga-panel" style={{ padding: '1.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <h3 className="font-heading" style={{ fontSize: '1.6rem' }}>{inq.client_name}</h3>
                          <span className="tape-tag">{inq.artwork_type}</span>
                        </div>
                        <a href={`mailto:${inq.client_email}`} style={{ color: 'var(--accent-purple)', fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>
                          {inq.client_email}
                        </a>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-yellow)' }}>
                          {inq.currency}: {inq.estimated_price}
                        </span>
                        <select
                          value={inq.status}
                          onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                          style={{
                            padding: '0.4rem 0.8rem',
                            backgroundColor: 'var(--bg-secondary)',
                            border: '1px solid var(--border-bold)',
                            color: 'var(--text-primary)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.8rem'
                          }}
                        >
                          <option value="new">Status: NEW</option>
                          <option value="in_progress">Status: IN PROGRESS</option>
                          <option value="completed">Status: COMPLETED</option>
                          <option value="declined">Status: DECLINED</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      <div>
                        <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DESCRIPTION:</span>
                        <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: '1.5' }}>{inq.description}</p>
                      </div>

                      {inq.reference_links && (
                        <div>
                          <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>REFERENCES:</span>
                          <p style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', wordBreak: 'break-all' }}>{inq.reference_links}</p>
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.5rem' }}>
                        <div>DEADLINE: <strong style={{ color: 'var(--text-primary)' }}>{inq.deadline || 'Flexible'}</strong></div>
                        <div>ADDITIONAL CHARACTERS: <strong style={{ color: 'var(--text-primary)' }}>{inq.additional_characters ? 'YES' : 'NO'}</strong></div>
                        <div>DETAILED BG: <strong style={{ color: 'var(--text-primary)' }}>{inq.detailed_background ? 'YES' : 'NO'}</strong></div>
                        <div>DATE: <strong style={{ color: 'var(--text-primary)' }}>{new Date(inq.created_at).toLocaleDateString()}</strong></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 3: ARTWORK MANAGER
            ======================================================== */}
        {activeTab === 'artworks' && (
          <div>
            {/* Add New Artwork Form */}
            <div className="manga-panel cut-corner" style={{ padding: '2rem', backgroundColor: 'var(--bg-card)', marginBottom: '3rem' }}>
              <h3 className="font-heading" style={{ fontSize: '1.8rem', marginBottom: '1.2rem' }}>
                ADD NEW MANAGED ARTWORK ENTRY
              </h3>

              <form onSubmit={handleAddArtwork} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem', alignItems: 'end' }}>
                <div>
                  <label className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
                    TITLE *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cyberpunk Katana"
                    value={newArt.title}
                    onChange={(e) => setNewArt({ ...newArt, title: e.target.value })}
                    required
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-bold)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div>
                  <label className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
                    COLLECTION CATEGORY
                  </label>
                  <select
                    value={newArt.category}
                    onChange={(e) => setNewArt({ ...newArt, category: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-bold)', color: 'var(--text-primary)' }}
                  >
                    <option value="commissioned-work">Commissioned Work</option>
                    <option value="personal-works">Personal Works</option>
                    <option value="sketches-and-studies">Sketches and Studies</option>
                    <option value="my-photo">My Photo</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
                    IMAGE FILE (UPLOAD OR URL)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleArtworkFileUpload}
                    style={{ width: '100%', fontSize: '0.85rem' }}
                  />
                  {uploadingArt && <span style={{ fontSize: '0.75rem', color: 'var(--accent-yellow)' }}>Uploading image to bucket...</span>}
                </div>

                <div>
                  <label className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
                    IMAGE URL (AUTO-FILLED ON UPLOAD) *
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={newArt.image_url}
                    onChange={(e) => setNewArt({ ...newArt, image_url: e.target.value })}
                    required
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-bold)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={newArt.featured}
                      onChange={(e) => setNewArt({ ...newArt, featured: e.target.checked })}
                      style={{ accentColor: 'var(--accent-purple)' }}
                    />
                    Featured
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={newArt.visible}
                      onChange={(e) => setNewArt({ ...newArt, visible: e.target.checked })}
                      style={{ accentColor: 'var(--accent-purple)' }}
                    />
                    Visible
                  </label>
                </div>

                <button type="submit" className="btn-manga" style={{ padding: '0.8rem' }}>
                  <Plus size={18} /> SAVE ARTWORK
                </button>
              </form>
            </div>

            {/* Managed Artworks List */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div className="section-subtitle">MANAGED ARTWORKS IN DATABASE ({artworks.length})</div>
              <button onClick={fetchArtworks} className="btn-manga-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                <RefreshCw size={14} /> REFRESH
              </button>
            </div>

            {loadingArtworks ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <RefreshCw size={28} className="spinning" style={{ margin: '0 auto', color: 'var(--accent-purple)' }} />
              </div>
            ) : artworks.length === 0 ? (
              <div className="manga-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No database-managed artworks yet. All 64 pieces are currently served from the repository manifest. You can add extra pieces above anytime!
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
                {artworks.map((item) => (
                  <div key={item.id} className="manga-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <img src={item.image_url} alt={item.title} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} />
                    <strong className="font-heading" style={{ fontSize: '1.2rem' }}>{item.title}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      Category: {item.category}
                    </div>
                    <button
                      onClick={() => deleteArtwork(item.id)}
                      className="btn-manga-secondary"
                      style={{ marginTop: 'auto', padding: '0.4rem', fontSize: '0.75rem', color: 'var(--accent-red)' }}
                    >
                      <Trash2 size={14} /> DELETE ENTRY
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 4: COMMISSION AVAILABILITY SETTINGS
            ======================================================== */}
        {activeTab === 'availability' && (
          <div style={{ maxWidth: '600px' }}>
            <div className="manga-panel cut-corner" style={{ padding: '2.5rem', backgroundColor: 'var(--bg-card)' }}>
              <h3 className="font-heading" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                COMMISSION AVAILABILITY CONTROLS
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                Toggle commission open/closed status. This directly updates the public badges on the Home, Commissions, and Navigation pages.
              </p>

              {settingsSuccess && (
                <div style={{ padding: '0.8rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', color: '#22c55e', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  ✓ Settings successfully persisted to Supabase!
                </div>
              )}

              <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-bold)' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1.1rem' }}>ACCEPTING COMMISSIONS</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {commissionsOpen ? 'Public site shows OPEN' : 'Public site shows TEMPORARILY CLOSED'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCommissionsOpen(!commissionsOpen)}
                    className={commissionsOpen ? 'btn-manga' : 'btn-manga btn-manga-secondary'}
                    style={{ padding: '0.5rem 1.2rem', backgroundColor: commissionsOpen ? '#22c55e' : 'transparent', borderColor: commissionsOpen ? '#22c55e' : 'var(--accent-red)', color: commissionsOpen ? '#000' : 'var(--accent-red)' }}
                  >
                    {commissionsOpen ? 'STATUS: OPEN' : 'STATUS: CLOSED'}
                  </button>
                </div>

                <div>
                  <label className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
                    CUSTOM AVAILABILITY NOTE / ANNOUNCEMENT
                  </label>
                  <textarea
                    rows="3"
                    value={availabilityNote}
                    onChange={(e) => setAvailabilityNote(e.target.value)}
                    placeholder="Currently accepting new commissions! Turnaround ~1 week."
                    style={{ width: '100%', padding: '0.8rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-bold)', color: 'var(--text-primary)' }}
                  />
                </div>

                <button type="submit" disabled={savingSettings} className="btn-manga" style={{ padding: '0.9rem' }}>
                  {savingSettings ? 'SAVING TO DATABASE...' : 'SAVE AVAILABILITY STATUS'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
