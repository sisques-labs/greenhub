import { BasePrimitives } from '@/shared/domain/primitives/base-primitives/base.primitives';

export type ContainerPrimitives = BasePrimitives & {
  id: string;
  name: string;
  type: string;
};
