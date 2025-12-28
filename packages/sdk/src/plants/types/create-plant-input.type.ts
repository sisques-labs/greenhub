import { PlantStatus } from './plant-status.type.js';

export type CreatePlantInput = {
  containerId: string;
  name: string;
  species: string;
  plantedDate?: string | null;
  notes?: string | null;
  status?: PlantStatus;
};
