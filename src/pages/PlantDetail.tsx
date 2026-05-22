import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlant, getDaysUntilCare, getUrgencyColor, logCare, addPhoto, deletePlant } from '../store';
import AppHeader from '../components/AppHeader';

export default function PlantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(0);
  const [activeTab, setActiveTab] = useState<'info' | 'photos' | 'history'>('info');
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const plant = getPlant(id!);

  if (!plant) {
    return (
      <div className="page">
        <AppHeader pageTitle="Not Found" backButton={() => navigate(-1)} />
        <div className="empty-state">
          <h2>Plant not found</h2>
          <button className="btn btn-primary" onClick={() => navigate('/plants')}>Go to Plants</button>
        </div>
      </div>
    );
  }

  const waterDays = getDaysUntilCare(plant, 'water');
  const fertDays = getDaysUntilCare(plant, 'fertilize');
  const soilDays = getDaysUntilCare(plant, 'soilChange');

  const handleLogCare = (type: 'water' | 'fertilize' | 'soilChange') => {
    logCare(plant.id, type);
    setRefresh(r => r + 1);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        // Resize image to save localStorage space
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxSize = 800;
          let w = img.width;
          let h = img.height;
          if (w > maxSize || h > maxSize) {
            if (w > h) { h = (h / w) * maxSize; w = maxSize; }
            else { w = (w / h) * maxSize; h = maxSize; }
          }
          canvas.width = w;
          canvas.height = h;
          canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          addPhoto(plant.id, dataUrl);
          setRefresh(r => r + 1);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleDelete = () => {
    deletePlant(plant.id);
    navigate('/plants');
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  // Force re-read on refresh
  void refresh;

  const sortedPhotos = [...plant.photos].reverse();

  return (
    <div className="page" style={{ padding: 0 }}>
      <AppHeader
        backButton={() => navigate(-1)}
        rightAction={{ label: 'Edit', onClick: () => navigate(`/plants/${plant.id}/edit`) }}
      />

      <div className="detail-hero">
        {plant.photos.length > 0 ? (
          <img src={plant.photos[plant.photos.length - 1].dataUrl} alt={plant.name} />
        ) : (
          <div className="detail-hero-placeholder">🌱</div>
        )}
      </div>

      <div style={{ padding: '0 16px 16px' }}>
        <div className="detail-header">
          <h1>{plant.name}</h1>
          <div className="scientific">{plant.scientificName}</div>
          {plant.location && (
            <div className="location">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {plant.location}
            </div>
          )}
        </div>

        <div className="detail-care-grid">
          {[
            { type: 'water' as const, label: 'Water', days: waterDays },
            { type: 'fertilize' as const, label: 'Fertilize', days: fertDays },
            { type: 'soilChange' as const, label: 'Soil', days: soilDays },
          ].map(({ type, label, days }) => (
            <div className="detail-care-item" key={type}>
              <div className="label">{label}</div>
              <div className="days" style={{ color: getUrgencyColor(days) }}>
                {days <= 0 ? 'Now!' : days}
              </div>
              {days > 0 && <div className="days-label">days left</div>}
              <button className="log-btn" onClick={() => handleLogCare(type)}>
                Log {label}
              </button>
            </div>
          ))}
        </div>

        <div className="tabs">
          {(['info', 'photos', 'history'] as const).map(tab => (
            <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'info' && (
          <>
            <div className="detail-section">
              <h2>Growing Conditions</h2>
              <div className="detail-info-grid">
                <div className="detail-info-item">
                  <div className="label">Sunlight</div>
                  <div className="value">{plant.sunlight || '—'}</div>
                </div>
                <div className="detail-info-item">
                  <div className="label">Humidity</div>
                  <div className="value">{plant.humidity || '—'}</div>
                </div>
                <div className="detail-info-item">
                  <div className="label">Temperature</div>
                  <div className="value">{plant.temperature || '—'}</div>
                </div>
                <div className="detail-info-item">
                  <div className="label">Pot Size</div>
                  <div className="value">{plant.potSize || '—'}</div>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h2>Care Schedule</h2>
              <div className="detail-info-grid">
                <div className="detail-info-item">
                  <div className="label">Water Every</div>
                  <div className="value">{plant.waterFrequency} days</div>
                </div>
                <div className="detail-info-item">
                  <div className="label">Fertilize Every</div>
                  <div className="value">{plant.fertilizeFrequency} days</div>
                </div>
                <div className="detail-info-item">
                  <div className="label">Change Soil Every</div>
                  <div className="value">{plant.soilChangeFrequency} days</div>
                </div>
                <div className="detail-info-item">
                  <div className="label">Location</div>
                  <div className="value">{plant.location || '—'}</div>
                </div>
              </div>
            </div>

            {plant.healthNotes && (
              <div className="detail-section">
                <h2>Health Notes</h2>
                <div className="detail-notes">{plant.healthNotes}</div>
              </div>
            )}

            {plant.generalNotes && (
              <div className="detail-section">
                <h2>Notes</h2>
                <div className="detail-notes">{plant.generalNotes}</div>
              </div>
            )}

            <div style={{ marginTop: '24px' }}>
              <button className="btn btn-danger btn-full" onClick={() => setShowDeleteConfirm(true)}>
                Delete Plant
              </button>
            </div>
          </>
        )}

        {activeTab === 'photos' && (
          <>
            <label className="upload-area">
              <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} />
              <div className="upload-area-icon">📷</div>
              <div className="upload-area-text">Tap to upload photos</div>
            </label>

            {sortedPhotos.length > 0 ? (
              <div className="photo-gallery">
                {sortedPhotos.map(photo => (
                  <div key={photo.id} className="photo-gallery-item" onClick={() => setLightboxPhoto(photo.dataUrl)}>
                    <img src={photo.dataUrl} alt={`${plant.name} - ${formatDate(photo.date)}`} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '24px' }}>
                <p>No photos yet. Upload your first photo above.</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'history' && (
          <>
            {[
              { key: 'waterHistory' as const, label: 'Watering', color: '#3498DB' },
              { key: 'fertilizeHistory' as const, label: 'Fertilizing', color: '#E67E22' },
              { key: 'soilChangeHistory' as const, label: 'Soil Changes', color: '#8B6914' },
              { key: 'moveHistory' as const, label: 'Moves', color: '#9B59B6' },
            ].map(({ key, label, color }) => (
              <div className="detail-section" key={key}>
                <h2>{label}</h2>
                {plant[key].length > 0 ? (
                  <div className="history-list">
                    {[...plant[key]].reverse().map((event, i) => (
                      <div className="history-item" key={i}>
                        <div className="history-dot" style={{ background: color }} />
                        <div>
                          {event.notes || label}
                          <div className="history-date">{formatDate(event.date)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No {label.toLowerCase()} recorded yet.</p>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      {lightboxPhoto && (
        <div className="lightbox" onClick={() => setLightboxPhoto(null)}>
          <button className="lightbox-close" onClick={() => setLightboxPhoto(null)}>×</button>
          <img src={lightboxPhoto} alt="Full size" />
        </div>
      )}

      {showDeleteConfirm && (
        <div className="action-sheet">
          <div className="action-sheet-backdrop" onClick={() => setShowDeleteConfirm(false)} />
          <div className="action-sheet-content">
            <div className="action-sheet-handle" />
            <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>Delete {plant.name}?</h2>
            <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              This will permanently remove this plant and all its data.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-secondary btn-full" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="btn btn-danger btn-full" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
