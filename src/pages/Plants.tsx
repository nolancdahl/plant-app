import { useNavigate } from 'react-router-dom';
import { loadPlants, getDaysUntilCare, getUrgencyColor } from '../store';
import AppHeader from '../components/AppHeader';

export default function Plants() {
  const navigate = useNavigate();
  const plants = loadPlants();

  return (
    <div className="page">
      <AppHeader pageTitle="Plants" />

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
        +
      </button>
    </div>
  );
}
