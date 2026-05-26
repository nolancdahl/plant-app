import { loadPlants, getDaysUntilCare } from '../store';
import AppHeader from '../components/AppHeader';

export default function Profile() {
  const plants = loadPlants();

  const totalWaterings = plants.reduce((sum, p) => sum + p.waterHistory.length, 0);
  const totalPhotos = plants.reduce((sum, p) => sum + p.photos.length, 0);
  const needsAttention = plants.filter(p =>
    getDaysUntilCare(p, 'water') <= 3 ||
    getDaysUntilCare(p, 'fertilize') <= 3 ||
    getDaysUntilCare(p, 'soilChange') <= 3
  ).length;

  return (
    <div className="page">
      <AppHeader />

      <div className="profile-header">
        <div className="profile-avatar">🌿</div>
        <h1 className="title-bold" style={{ fontSize: '24px' }}>Plant Parent</h1>
        <p className="page-subtitle" style={{ marginTop: '4px' }}>
          Keeping your garden green
        </p>
      </div>

      <div className="profile-stats">
        <div className="profile-stat">
          <div className="number">{plants.length}</div>
          <div className="label">Plants</div>
        </div>
        <div className="profile-stat">
          <div className="number">{totalWaterings}</div>
          <div className="label">Waterings</div>
        </div>
        <div className="profile-stat">
          <div className="number">{totalPhotos}</div>
          <div className="label">Photos</div>
        </div>
      </div>

      {needsAttention > 0 && (
        <div className="tile" style={{ padding: '16px', marginBottom: '16px', textAlign: 'center' }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--red)' }}>{needsAttention}</strong> plant{needsAttention !== 1 ? 's' : ''} need attention soon
          </p>
        </div>
      )}

      <h2 className="section-title">About</h2>
      <div className="tile" style={{ padding: '16px', marginBottom: '16px' }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          Mano Verde helps you track your plants' care schedules, monitor their health, and document their growth through photos.
        </p>
      </div>

      <h2 className="section-title">Storage</h2>
      <div className="tile" style={{ padding: '16px' }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          Data is stored locally on this device. Photos are compressed to save space.
          {(() => {
            try {
              const used = new Blob([localStorage.getItem('verdant_plants') || '']).size;
              const mb = (used / 1024 / 1024).toFixed(2);
              return ` Using ${mb} MB.`;
            } catch {
              return '';
            }
          })()}
        </p>
      </div>
    </div>
  );
}
