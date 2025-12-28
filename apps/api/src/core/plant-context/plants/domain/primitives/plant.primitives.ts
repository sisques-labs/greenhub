import { BasePrimitives } from '@/shared/domain/primitives/base-primitives/base.primitives';

export type PlantPrimitives = BasePrimitives & {
  id: string;
  containerId: string;
  name: string;
  species: string;
  plantedDate: Date | null;
  notes: string | null;
  status: string;
};
