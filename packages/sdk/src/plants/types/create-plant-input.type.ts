import { PlantStatus } from './plant-status.type.js';

export type CreatePlantInput = {
  growingUnitId: string;
  name: string;
  species: string;
  plantedDate?: Date | null;
  notes?: string | null;
  status?: PlantStatus;
};
