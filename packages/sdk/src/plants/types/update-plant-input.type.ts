import { PlantStatus } from './plant-status.type.js';

export type UpdatePlantInput = {
  id: string;
  containerId?: string;
  name?: string;
  species?: string;
  plantedDate?: string | null;
  notes?: string | null;
  status?: PlantStatus;
};
