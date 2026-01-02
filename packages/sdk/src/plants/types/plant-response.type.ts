import type { LocationResponse } from '../../locations/index.js';
import type { PlantGrowingUnitReference } from './plant-growing-unit-reference.type.js';
import { PlantStatus } from './plant-status.type.js';

export type PlantResponse = {
  id: string;
  growingUnitId?: string | null;
  name: string;
  species: string;
  plantedDate?: Date | null;
  notes?: string | null;
  status: PlantStatus;
  location?: LocationResponse;
  growingUnit?: PlantGrowingUnitReference;
  createdAt?: Date;
  updatedAt?: Date;
};
