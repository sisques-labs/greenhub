import { GrowingUnitType } from './growing-unit-type.type.js';
import { LengthUnit } from './length-unit.type.js';

export type CreateGrowingUnitInput = {
  name: string;
  type: GrowingUnitType;
  capacity: number;
  length?: number;
  width?: number;
  height?: number;
  unit?: LengthUnit;
};
