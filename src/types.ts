export interface CareEvent {
  date: string; // ISO date string
  notes?: string;
}

export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  location: string;
  potSize: string; // e.g. "6 inch", "10 inch"

  // Photos
  photos: PlantPhoto[];
  referencePhotos: string[]; // URLs to reference images

  // Care schedule (in days)
  waterFrequency: number;
  fertilizeFrequency: number;
  soilChangeFrequency: number;

  // Ideal growing conditions
  sunlight: string; // e.g. "Bright indirect", "Full sun", "Low light"
  humidity: string; // e.g. "High", "Medium", "Low"
  temperature: string; // e.g. "65-80F"

  // Care history
  waterHistory: CareEvent[];
  fertilizeHistory: CareEvent[];
  soilChangeHistory: CareEvent[];
  moveHistory: CareEvent[];

  // Notes
  healthNotes: string;
  generalNotes: string;

  createdAt: string;
}

export interface PlantPhoto {
  id: string;
  dataUrl: string; // base64 data URL for localStorage
  date: string;
  caption?: string;
}

export type CareType = 'water' | 'fertilize' | 'soilChange';
