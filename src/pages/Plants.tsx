import { useNavigate } from 'react-router-dom';
import { loadPlants, getDaysUntilCare, getUrgencyColor } from '../store';
import AppHeader from '../components/AppHeader';

export default function Plants() {
  const navigate = useNavigate();
  const plants = loadPlants();

  return (
    <div className="page">
      <AppHeader />

      <div style={{ marginBottom: '20px' }}>
        <h2 className="title-bold" style={{ fontSize: '34px', margin: 0, lineHeight: 1.0 }}>
          Plants
        </h2>
        <div className="page-subtitle">
          {plants.length === 0
            ? 'Your collection is empty'
            : `${plants.length} in your collection`}
        </div>
      </div>

      {plants.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🪴</div>
          <h2>No plants yet</h2>
          <p>Add plants to see them here</p>
          <button className="btn btn-primary" onClick={() => navigate('/plants/new')}>
            Add Plant
          </button>
        </div>
      ) : (
        <div className="plant-grid">
          {plants.map((plant) => {
            const waterDays = getDaysUntilCare(plant, 'water');
            const fertDays = getDaysUntilCare(plant, 'fertilize');
            const soilDays = getDaysUntilCare(plant, 'soilChange');

            return (
              <div
                key={plant.id}
                className="plant-grid-item"
                onClick={() => navigate(`/plants/${plant.id}`)}
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
      )}

      <button className="fab" onClick={() => navigate('/plants/new')} aria-label="Add plant">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add Plant
      </button>
    </div>
  );
}
