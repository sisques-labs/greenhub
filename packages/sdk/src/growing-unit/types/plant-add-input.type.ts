import { PlantStatus } from '../../plants/types/plant-status.type.js';

export type PlantAddInput = {
  growingUnitId: string;
  name: string;
  species: string;
  plantedDate?: Date | null;
  notes?: string | null;
  status?: PlantStatus;
};



