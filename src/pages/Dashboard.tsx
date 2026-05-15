import { useNavigate } from 'react-router-dom';
import { loadPlants, getDaysUntilCare, getUrgencyColor } from '../store';
import type { Plant, CareType } from '../types';

interface CareItem {
  plant: Plant;
  type: CareType;
  days: number;
  label: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const plants = loadPlants();

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

  return (
    <div className="page">
      <div className="header">
        <h1>Verdant</h1>
      </div>

      <div className="dashboard-greeting">
        <h1>Your Garden</h1>
        <p>
          {plants.length === 0
            ? 'Add your first plant to get started'
            : `${plants.length} plant${plants.length !== 1 ? 's' : ''} in your collection`}
        </p>
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
                    style={{ cursor: 'pointer' }}
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
            <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>✨</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                All plants are happy! Nothing needs attention in the next 3 days.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
