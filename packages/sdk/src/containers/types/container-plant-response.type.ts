export type ContainerPlantResponse = {
  id: string;
  name: string;
  species: string;
  plantedDate?: Date | null;
  notes?: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};
