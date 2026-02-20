import { NumberValueObject } from '@/shared/domain/value-objects/number/number.vo';

/**
 * Value object representing the growth time of a plant species in days to maturity.
 */
export class PlantSpeciesGrowthTimeValueObject extends NumberValueObject {
	constructor(value: number | string) {
		super(value, {
			min: 1,
			allowDecimals: false,
		});
	}
}
