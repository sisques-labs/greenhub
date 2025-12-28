import { ContainerType } from './container-type.type.js';

export type UpdateContainerInput = {
  id: string;
  name?: string;
  type?: ContainerType;
};
