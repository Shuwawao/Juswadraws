import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Layers, Eye, RefreshCw, Sparkles, FolderOpen } from 'lucide-react';
import { ARTWORKS, CATEGORIES } from '../data/artworksManifest';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';
import ImageViewerModal from '../components/ImageViewerModal';
import soundFx from '../utils/soundFx';

export default function Artworks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategoryParam = searchParams.get('category') || 'all';

  const [activeCategory, setActiveCategory] = useState(activeCategoryParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [managedArtworks, setManagedArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sync category param with URL
  const handleCategoryChange = (catId) => {
    soundFx.playTab();
    setActiveCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  // Fetch optional dashboard-managed artworks from Supabase if connected
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    let isMounted = true;
    async function fetchDatabaseArtworks() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('artworks')
          .select('*')
          .eq('visible', true)
          .order('sort_order', { ascending: true });

        if (!error && data && isMounted) {
          // Normalize DB artworks
          const formatted = data.map((item) => ({
            id: `db-${item.id}`,
            fileName: item.title,
            cleanFileName: item.title,
            folder: item.category,
            categoryId: item.category,
            categoryName: item.category.replace(/-/g, ' ').toUpperCase(),
            badge: 'MANAGED',
            title: item.title,
            url: item.image_url,
            isFeatured: item.featured,
            isBrandAsset: false,
            tags: [item.category]
          }));
          setManagedArtworks(formatted);
        }
      } catch (err) {
        console.warn('Could not load database artworks, showing manifest catalog:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchDatabaseArtworks();
    return () => {
      isMounted = false;
    };
  }, []);

  // Merge static manifest with any DB entries
  const allArtworks = useMemo(() => {
    return [...managedArtworks, ...ARTWORKS];
  }, [managedArtworks]);

  // Filter artworks by category and search query
  const filteredArtworks = useMemo(() => {
    return allArtworks.filter((art) => {
      // Don't show brand favicon or font asset in general art grid unless selected
      if (art.isBrandAsset && activeCategory !== 'my-photo') return false;

      const matchesCategory =
        activeCategory === 'all' || art.categoryId === activeCategory;

      const matchesSearch =
        !searchQuery.trim() ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.categoryName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [allArtworks, activeCategory, searchQuery]);

  // Modal navigation helpers
  const currentIdx = useMemo(() => {
    if (!selectedArtwork) return -1;
    return filteredArtworks.findIndex((a) => a.id === selectedArtwork.id);
  }, [selectedArtwork, filteredArtworks]);

  const handlePrev = () => {
    if (currentIdx > 0) {
      setSelectedArtwork(filteredArtworks[currentIdx - 1]);
    }
  };

  const handleNext = () => {
    if (currentIdx < filteredArtworks.length - 1) {
      setSelectedArtwork(filteredArtworks[currentIdx + 1]);
    }
  };

  // Category counts
  const getCategoryCount = (catId) => {
    if (catId === 'all') {
      return allArtworks.filter((a) => !a.isBrandAsset).length;
    }
    return allArtworks.filter((a) => a.categoryId === catId).length;
  };

  return (
    <div style={{ padding: 'clamp(2rem, 5vw, 4rem) 0', minHeight: '80vh' }}>
      <div className="container">
        {/* Header Title Section (Manga Catalog Header, Ref 1) */}
        <div style={{ marginBottom: '3rem' }}>
          <div className="section-subtitle">VAULT ARCHIVE // COMPLETE CHAPTER CATALOG</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
            <h1 className="section-title">MANGA & ARTWORK CATALOG</h1>
            <div className="speech-bubble">
              <span>{filteredArtworks.length} CHAPTERS IN VAULT</span>
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.8rem', maxWidth: '650px', fontSize: '1.05rem' }}>
            The official digital art archive of JUSWADRAWS: character illustrations, manga studies, client commissions, and kinetic action panels.
          </p>
        </div>

        {/* Filter Controls & Search Bar */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            marginBottom: '3rem',
            borderBottom: '2.5px solid var(--text-primary)',
            paddingBottom: '2rem'
          }}
        >
          {/* Category Tabs (Manga Volume Selection) */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              alignItems: 'center'
            }}
          >
            <button
              onClick={() => handleCategoryChange('all')}
              onMouseEnter={() => soundFx.playHover()}
              className={activeCategory === 'all' ? 'btn-manga btn-manga-red' : 'btn-manga btn-manga-secondary'}
              style={{ padding: '0.55rem 1.15rem', fontSize: '0.95rem' }}
            >
              ALL VOLUMES ({getCategoryCount('all')})
            </button>

            {CATEGORIES.map((cat, catIdx) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                onMouseEnter={() => soundFx.playHover()}
                className={activeCategory === cat.id ? 'btn-manga btn-manga-red' : 'btn-manga btn-manga-secondary'}
                style={{ padding: '0.55rem 1.15rem', fontSize: '0.95rem' }}
              >
                VOL. 0{catIdx + 1}: {cat.name.toUpperCase()} ({getCategoryCount(cat.id)})
              </button>
            ))}
          </div>

          {/* Search Input Box with Manga Border */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-secondary)',
              border: '2.5px solid var(--text-primary)',
              padding: '0.65rem 1.25rem',
              maxWidth: '500px',
              gap: '0.8rem',
              boxShadow: '4px 4px 0px var(--text-primary)'
            }}
          >
            <Search size={18} color="var(--accent-red)" />
            <input
              type="text"
              placeholder="Search catalog by title, character, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  soundFx.playPop();
                }}
                style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}
              >
                CLEAR
              </button>
            )}
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredArtworks.length === 0 ? (
          <div
            className="manga-panel"
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            <FolderOpen size={48} color="var(--text-muted)" />
            <h3 className="font-heading" style={{ fontSize: '1.8rem' }}>NO ARTWORKS FOUND</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
              No pieces matched your search &ldquo;{searchQuery}&rdquo;. Try another keyword or switch category filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                handleCategoryChange('all');
                soundFx.playClick();
              }}
              onMouseEnter={() => soundFx.playHover()}
              className="btn-manga"
            >
              RESET FILTERS
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.8rem'
            }}
          >
            {filteredArtworks.map((art, idx) => (
              <div
                key={art.id}
                className="manga-panel-card artwork-card-entry"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  backgroundColor: 'var(--bg-card)',
                  animationDelay: `${Math.min(idx * 0.03, 0.35)}s`
                }}
                onClick={() => {
                  soundFx.playChime();
                  setSelectedArtwork(art);
                }}
                onMouseEnter={() => soundFx.playHover()}
              >
                {/* Technical Corner Drafting Marks */}
                <span className="drafting-corner-mark-tl">+</span>
                <span className="drafting-corner-mark-tr">+</span>

                {/* Image Frame */}
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: idx % 3 === 0 ? '4 / 5' : '1 / 1',
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderBottom: '2px solid var(--text-primary)'
                  }}
                >
                  <img
                    src={art.url}
                    alt={art.title}
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />

                  {/* Corner Narrator Badge */}
                  <div style={{ position: 'absolute', top: '0.65rem', left: '0.65rem' }}>
                    <span className="manga-narrator-box">
                      ACT #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </span>
                  </div>

                  {/* Expand Tag on Image */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '0.6rem',
                      right: '0.6rem',
                      backgroundColor: 'rgba(0,0,0,0.85)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      padding: '0.25rem 0.55rem',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem'
                    }}
                  >
                    <Eye size={12} color="var(--accent-red)" />
                    <span>EXPAND</span>
                  </div>
                </div>

                {/* Info Metadata (Matching Manga Chapter Layout, Ref 1) */}
                <div style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--accent-red)', fontWeight: 700 }}>
                      {art.categoryName}
                    </span>
                    <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </span>
                  </div>

                  <h3
                    className="font-heading"
                    style={{
                      fontSize: '1.35rem',
                      letterSpacing: '0.03em',
                      color: 'var(--text-primary)',
                      lineHeight: '1.2'
                    }}
                  >
                    {art.title}
                  </h3>

                  <div
                    className="font-mono"
                    style={{
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                      borderTop: '1px dashed var(--border-color)',
                      paddingTop: '0.45rem',
                      marginTop: '0.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>MANGA VAULT</span>
                    <span style={{ color: 'var(--accent-red)' }}>ACT #{idx + 1}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal Image Viewer */}
      {selectedArtwork && (
        <ImageViewerModal
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={currentIdx > 0}
          hasNext={currentIdx < filteredArtworks.length - 1}
          prevArtwork={currentIdx > 0 ? filteredArtworks[currentIdx - 1] : null}
          nextArtwork={currentIdx < filteredArtworks.length - 1 ? filteredArtworks[currentIdx + 1] : null}
        />
      )}
    </div>
  );
}
