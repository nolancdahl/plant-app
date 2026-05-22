import type { Plant, CareEvent } from './types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'verdant_plants';

export function loadPlants(): Plant[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function savePlants(plants: Plant[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
}

export function addPlant(plant: Omit<Plant, 'id' | 'createdAt' | 'waterHistory' | 'fertilizeHistory' | 'soilChangeHistory' | 'moveHistory' | 'photos' | 'referencePhotos'>): Plant {
  const plants = loadPlants();
  const newPlant: Plant = {
    ...plant,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    waterHistory: [],
    fertilizeHistory: [],
    soilChangeHistory: [],
    moveHistory: [],
    photos: [],
    referencePhotos: [],
  };
  plants.push(newPlant);
  savePlants(plants);
  return newPlant;
}

export function updatePlant(id: string, updates: Partial<Plant>): Plant | null {
  const plants = loadPlants();
  const idx = plants.findIndex(p => p.id === id);
  if (idx === -1) return null;
  plants[idx] = { ...plants[idx], ...updates };
  savePlants(plants);
  return plants[idx];
}

export function deletePlant(id: string): void {
  const plants = loadPlants().filter(p => p.id !== id);
  savePlants(plants);
}

export function getPlant(id: string): Plant | undefined {
  return loadPlants().find(p => p.id === id);
}

export function logCare(plantId: string, type: 'water' | 'fertilize' | 'soilChange', notes?: string): void {
  const plants = loadPlants();
  const plant = plants.find(p => p.id === plantId);
  if (!plant) return;

  const event: CareEvent = { date: new Date().toISOString(), notes };
  const historyKey = type === 'water' ? 'waterHistory' :
    type === 'fertilize' ? 'fertilizeHistory' : 'soilChangeHistory';

  plant[historyKey].push(event);
  savePlants(plants);
}

export function addPhoto(plantId: string, dataUrl: string, caption?: string): void {
  const plants = loadPlants();
  const plant = plants.find(p => p.id === plantId);
  if (!plant) return;

  plant.photos.push({
    id: uuidv4(),
    dataUrl,
    date: new Date().toISOString(),
    caption,
  });
  savePlants(plants);
}

export function getDaysUntilCare(plant: Plant, type: 'water' | 'fertilize' | 'soilChange'): number {
  const historyKey = type === 'water' ? 'waterHistory' :
    type === 'fertilize' ? 'fertilizeHistory' : 'soilChangeHistory';
  const frequencyKey = type === 'water' ? 'waterFrequency' :
    type === 'fertilize' ? 'fertilizeFrequency' : 'soilChangeFrequency';

  const history = plant[historyKey];
  const frequency = plant[frequencyKey];

  if (history.length === 0) return 0; // needs care now

  const lastCare = new Date(history[history.length - 1].date);
  const nextCare = new Date(lastCare.getTime() + frequency * 24 * 60 * 60 * 1000);
  const now = new Date();
  const diff = Math.ceil((nextCare.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
  return diff;
}

export function getUrgencyColor(days: number): string {
  if (days <= 2) return '#E74C3C';
  if (days <= 4) return '#F2D024';
  return '#5FB87E';
}
