import { PlantStatus } from '../../plants/types/plant-status.type.js';

export type ContainerPlantResponse = {
  id: string;
  name: string;
  species: string;
  plantedDate?: Date | null;
  notes?: string | null;
  status: PlantStatus;
  createdAt: Date;
  updatedAt: Date;
};
