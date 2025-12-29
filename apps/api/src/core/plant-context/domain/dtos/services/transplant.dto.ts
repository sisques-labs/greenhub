import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';

/**
 * Data transfer object for transplanting a plant between growing units.
 *
 * @remarks
 * Used to encapsulate the information required to move a plant from one growing unit to another.
 *
 * @property sourceGrowingUnit - The growing unit from which the plant will be transplanted.
 * @property targetGrowingUnit - The growing unit to which the plant will be transplanted.
 * @property plantId - The identifier of the plant to be transplanted.
 */
export interface ITransplantPlantDto {
  /**
   * The growing unit from which the plant will be transplanted.
   */
  sourceGrowingUnit: GrowingUnitAggregate;
  /**
   * The growing unit to which the plant will be transplanted.
   */
  targetGrowingUnit: GrowingUnitAggregate;
  /**
   * The identifier of the plant to be transplanted.
   */
  plantId: string;
}
