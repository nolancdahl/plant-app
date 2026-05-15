import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import Plants from './pages/Plants';
import PlantDetail from './pages/PlantDetail';
import AddEditPlant from './pages/AddEditPlant';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/plants" element={<Plants />} />
          <Route path="/plants/:id" element={<PlantDetail />} />
          <Route path="/plants/new" element={<AddEditPlant />} />
          <Route path="/plants/:id/edit" element={<AddEditPlant />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
