import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadPlants, getDaysUntilCare, getUrgencyColor } from '../store';
import type { Plant, CareType } from '../types';
import AppHeader from '../components/AppHeader';

interface CareItem {
  plant: Plant;
  type: CareType;
  days: number;
  label: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const plants = loadPlants();
  const [lightbox, setLightbox] = useState<{ src: string; plantId: string } | null>(null);

  const careItems: CareItem[] = [];
  const careTypes: { type: CareType; label: string }[] = [
    { type: 'water', label: 'Water' },
    { type: 'fertilize', label: 'Fertilize' },
    { type: 'soilChange', label: 'Change Soil' },
  ];

  plants.forEach((plant) => {
    careTypes.forEach(({ type, label }) => {
      const days = getDaysUntilCare(plant, type);
      if (days <= 3) {
        careItems.push({ plant, type, days, label });
      }
    });
  });

  careItems.sort((a, b) => a.days - b.days);

  const getThumb = (plant: Plant) => {
    if (plant.photos.length > 0) {
      return <img src={plant.photos[plant.photos.length - 1].dataUrl} alt={plant.name} />;
    }
    return <span>🌱</span>;
  };

  const handleTileClick = (plant: Plant) => {
    if (plant.photos.length > 0) {
      setLightbox({ src: plant.photos[plant.photos.length - 1].dataUrl, plantId: plant.id });
    } else {
      navigate(`/plants/${plant.id}`);
    }
  };

  return (
    <div className="page">
      <AppHeader />

      {/* Greeting */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 className="title-bold" style={{ fontSize: '26px', margin: 0, lineHeight: 1.1 }}>
          Your Garden
        </h2>
        <div className="page-subtitle" style={{ marginTop: '6px' }}>
          {plants.length === 0
            ? 'Add your first plant to get started'
            : `${plants.length} plant${plants.length !== 1 ? 's' : ''} in your collection`}
        </div>
      </div>

      {plants.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🌿</div>
          <h2>No plants yet</h2>
          <p>Start building your plant collection</p>
          <button className="btn btn-primary" onClick={() => navigate('/plants/new')}>
            Add Your First Plant
          </button>
        </div>
      ) : (
        <>
          {careItems.length > 0 && (
            <div>
              <h2 className="section-title">Needs Attention</h2>
              <div className="care-list">
                {careItems.map((item, i) => (
                  <div
                    key={`${item.plant.id}-${item.type}-${i}`}
                    className="care-card"
                    onClick={() => navigate(`/plants/${item.plant.id}`)}
                  >
                    <div className="care-card-thumb">{getThumb(item.plant)}</div>
                    <div className="care-card-info">
                      <div className="care-card-name">{item.plant.name}</div>
                      <div className="care-card-detail">{item.label}</div>
                    </div>
                    <div className="care-card-days" style={{ color: getUrgencyColor(item.days) }}>
                      {item.days <= 0 ? 'Now' : item.days}
                      {item.days > 0 && <small>days</small>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {careItems.length === 0 && (
            <div className="tile" style={{ textAlign: 'center', padding: '24px' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>✨</div>
              <p style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif", fontSize: '14px' }}>
                All plants are happy! Nothing needs attention in the next 3 days.
              </p>
            </div>
          )}

          <h2 className="section-title">Your Plants</h2>
          <div className="plant-grid">
            {plants.slice(0, 4).map((plant) => {
              const waterDays = getDaysUntilCare(plant, 'water');
              const fertDays = getDaysUntilCare(plant, 'fertilize');
              const soilDays = getDaysUntilCare(plant, 'soilChange');
              return (
                <div
                  key={plant.id}
                  className="plant-grid-item"
                  onClick={() => handleTileClick(plant)}
                >
                  {plant.photos.length > 0 ? (
                    <img src={plant.photos[plant.photos.length - 1].dataUrl} alt={plant.name} />
                  ) : (
                    <div className="plant-placeholder">🌱</div>
                  )}
                  <div className="plant-grid-badges">
                    <div className="mini-badge" style={{ background: getUrgencyColor(waterDays) }} title={`Water: ${waterDays} days`} />
                    <div className="mini-badge" style={{ background: getUrgencyColor(fertDays) }} title={`Fertilize: ${fertDays} days`} />
                    <div className="mini-badge" style={{ background: getUrgencyColor(soilDays) }} title={`Soil: ${soilDays} days`} />
                  </div>
                  <div className="plant-grid-overlay">
                    <div className="plant-name">{plant.name}</div>
                    <div className="plant-scientific">{plant.scientificName}</div>
                  </div>
                </div>
              );
            })}
          </div>
          {plants.length > 4 && (
            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => navigate('/plants')}
              >
                View all {plants.length} plants
              </button>
            </div>
          )}
        </>
      )}

      {lightbox && (
        <PlantLightbox
          src={lightbox.src}
          onClose={() => setLightbox(null)}
          onViewDetail={() => { setLightbox(null); navigate(`/plants/${lightbox.plantId}`); }}
        />
      )}
    </div>
  );
}

/* ——— Pinch-to-zoom lightbox ——— */
function PlantLightbox({ src, onClose, onViewDetail }: { src: string; onClose: () => void; onViewDetail: () => void }) {
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const lastDist = useRef<number | null>(null);
  const lastCenter = useRef<{ x: number; y: number } | null>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  const dist = (t: TouchList) => {
    const dx = t[0].clientX - t[1].clientX;
    const dy = t[0].clientY - t[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const center = (t: TouchList) => ({
    x: (t[0].clientX + t[1].clientX) / 2,
    y: (t[0].clientY + t[1].clientY) / 2,
  });

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      lastDist.current = dist(e.touches);
      lastCenter.current = center(e.touches);
    } else if (e.touches.length === 1 && scale > 1) {
      dragStart.current = { x: e.touches[0].clientX - translate.x, y: e.touches[0].clientY - translate.y };
    }
  }, [scale, translate]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastDist.current !== null) {
      e.preventDefault();
      const d = dist(e.touches);
      const ratio = d / lastDist.current;
      setScale((s) => Math.min(Math.max(s * ratio, 1), 5));
      lastDist.current = d;
    } else if (e.touches.length === 1 && dragStart.current && scale > 1) {
      e.preventDefault();
      setTranslate({
        x: e.touches[0].clientX - dragStart.current.x,
        y: e.touches[0].clientY - dragStart.current.y,
      });
    }
  }, [scale]);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      lastDist.current = null;
      lastCenter.current = null;
    }
    if (e.touches.length === 0) {
      dragStart.current = null;
      if (scale <= 1) {
        setTranslate({ x: 0, y: 0 });
      }
    }
  }, [scale]);

  const reset = () => { setScale(1); setTranslate({ x: 0, y: 0 }); };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
        zIndex: 200, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.2s ease',
        touchAction: 'none',
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: '16px', right: '16px', zIndex: 201,
          color: 'white', fontSize: '28px', background: 'none', border: 'none',
          cursor: 'pointer', padding: '4px 8px',
        }}
      >
        ×
      </button>

      {/* Image — takes up most of the viewport */}
      <img
        src={src}
        alt="Plant"
        onDoubleClick={() => scale > 1 ? reset() : setScale(2.5)}
        style={{
          maxWidth: '95vw',
          maxHeight: '80vh',
          objectFit: 'contain',
          borderRadius: '8px',
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          transition: scale === 1 ? 'transform 0.2s ease' : 'none',
          cursor: scale > 1 ? 'grab' : 'zoom-in',
        }}
      />

      {/* View details pill */}
      <button
        onClick={onViewDetail}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          borderRadius: '999px',
          background: 'rgba(122, 207, 152, 0.15)',
          color: '#7ACF98',
          border: '1px solid rgba(122, 207, 152, 0.3)',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase' as const,
          cursor: 'pointer',
        }}
      >
        View plant details
      </button>
    </div>
  );
}
