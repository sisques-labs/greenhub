import { ContainerPlantResponse } from './container-plant-response.type.js';

export type ContainerResponse = {
  id: string;
  name: string;
  type: string;
  plants: ContainerPlantResponse[];
  numberOfPlants: number;
  createdAt?: Date;
  updatedAt?: Date;
};
