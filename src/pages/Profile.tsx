import { loadPlants, getDaysUntilCare } from '../store';

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
      <div className="header">
        <h1>Profile</h1>
      </div>

      <div className="profile-header">
        <div className="profile-avatar">🌿</div>
        <h1 style={{ fontSize: '24px' }}>Plant Parent</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
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
        <div className="card" style={{ marginBottom: '16px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--red)' }}>{needsAttention}</strong> plant{needsAttention !== 1 ? 's' : ''} need attention soon
          </p>
        </div>
      )}

      <div className="card" style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '16px', marginBottom: '12px' }}>About</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          Verdant helps you track your plants' care schedules, monitor their health, and document their growth through photos.
        </p>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '16px', marginBottom: '12px' }}>Storage</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          Data is stored locally on this device. Photos are compressed to save space.
          {(() => {
            try {
              const used = new Blob([localStorage.getItem('verdant_plants') || '']).size;
              const mb = (used / 1024 / 1024).toFixed(2);
              return ` Currently using ${mb} MB.`;
            } catch {
              return '';
            }
          })()}
        </p>
      </div>
    </div>
  );
}
