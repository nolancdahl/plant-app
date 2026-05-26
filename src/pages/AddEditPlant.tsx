import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlant, addPlant, updatePlant } from '../store';
import AppHeader from '../components/AppHeader';

export default function AddEditPlant() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    scientificName: '',
    location: '',
    potSize: '',
    sunlight: '',
    humidity: '',
    temperature: '',
    waterFrequency: 7,
    fertilizeFrequency: 30,
    soilChangeFrequency: 365,
    healthNotes: '',
    generalNotes: '',
  });

  useEffect(() => {
    if (id) {
      const plant = getPlant(id);
      if (plant) {
        setForm({
          name: plant.name,
          scientificName: plant.scientificName,
          location: plant.location,
          potSize: plant.potSize,
          sunlight: plant.sunlight,
          humidity: plant.humidity,
          temperature: plant.temperature,
          waterFrequency: plant.waterFrequency,
          fertilizeFrequency: plant.fertilizeFrequency,
          soilChangeFrequency: plant.soilChangeFrequency,
          healthNotes: plant.healthNotes,
          generalNotes: plant.generalNotes,
        });
      }
    }
  }, [id]);

  const handleChange = (field: string, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;

    if (isEdit && id) {
      updatePlant(id, form);
      navigate(`/plants/${id}`);
    } else {
      const plant = addPlant(form);
      navigate(`/plants/${plant.id}`);
    }
  };

  return (
    <div className="page">
      <AppHeader
        pageTitle={isEdit ? 'Edit Plant' : 'New Plant'}
        backButton={() => navigate(-1)}
        rightAction={{ label: 'Save', onClick: handleSubmit }}
      />

      <div className="form-group">
        <label className="form-label">Plant Name *</label>
        <input
          className="form-input"
          placeholder="e.g. Monstera"
          value={form.name}
          onChange={e => handleChange('name', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Scientific Name</label>
        <input
          className="form-input"
          placeholder="e.g. Monstera deliciosa"
          value={form.scientificName}
          onChange={e => handleChange('scientificName', e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Location</label>
          <input
            className="form-input"
            placeholder="e.g. Office, 3rd floor"
            value={form.location}
            onChange={e => handleChange('location', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Pot Size</label>
          <input
            className="form-input"
            placeholder='e.g. 6"'
            value={form.potSize}
            onChange={e => handleChange('potSize', e.target.value)}
          />
        </div>
      </div>

      <h2 className="section-title" style={{ margin: '24px 0 12px' }}>Growing Conditions</h2>

      <div className="form-group">
        <label className="form-label">Sunlight</label>
        <select className="form-input" value={form.sunlight} onChange={e => handleChange('sunlight', e.target.value)}>
          <option value="">Select...</option>
          <option value="Full Sun">Full Sun</option>
          <option value="Bright Indirect">Bright Indirect</option>
          <option value="Medium Light">Medium Light</option>
          <option value="Low Light">Low Light</option>
          <option value="Shade">Shade</option>
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Humidity</label>
          <select className="form-input" value={form.humidity} onChange={e => handleChange('humidity', e.target.value)}>
            <option value="">Select...</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Temperature</label>
          <input
            className="form-input"
            placeholder="e.g. 65-80°F"
            value={form.temperature}
            onChange={e => handleChange('temperature', e.target.value)}
          />
        </div>
      </div>

      <h2 className="section-title" style={{ margin: '24px 0 12px' }}>Care Schedule</h2>

      <div className="form-group">
        <label className="form-label">Water Every (days)</label>
        <input
          className="form-input"
          type="number"
          min="1"
          value={form.waterFrequency}
          onChange={e => handleChange('waterFrequency', parseInt(e.target.value) || 1)}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Fertilize Every (days)</label>
          <input
            className="form-input"
            type="number"
            min="1"
            value={form.fertilizeFrequency}
            onChange={e => handleChange('fertilizeFrequency', parseInt(e.target.value) || 1)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Change Soil Every (days)</label>
          <input
            className="form-input"
            type="number"
            min="1"
            value={form.soilChangeFrequency}
            onChange={e => handleChange('soilChangeFrequency', parseInt(e.target.value) || 1)}
          />
        </div>
      </div>

      <h2 className="section-title" style={{ margin: '24px 0 12px' }}>Notes</h2>

      <div className="form-group">
        <label className="form-label">Health Notes</label>
        <textarea
          className="form-input form-textarea"
          placeholder="Any observations about plant health..."
          value={form.healthNotes}
          onChange={e => handleChange('healthNotes', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">General Notes</label>
        <textarea
          className="form-input form-textarea"
          placeholder="Any other notes..."
          value={form.generalNotes}
          onChange={e => handleChange('generalNotes', e.target.value)}
        />
      </div>

      <button className="btn btn-primary btn-full" onClick={handleSubmit} style={{ marginTop: '8px' }}>
        {isEdit ? 'Save Changes' : 'Add Plant'}
      </button>
    </div>
  );
}
