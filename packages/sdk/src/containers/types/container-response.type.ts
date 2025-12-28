import { ContainerPlantResponse } from './container-plant-response.type.js';
import { ContainerType } from './container-type.type.js';

export type ContainerResponse = {
  id: string;
  name: string;
  type: ContainerType;
  plants: ContainerPlantResponse[];
  numberOfPlants: number;
  createdAt?: Date;
  updatedAt?: Date;
};
