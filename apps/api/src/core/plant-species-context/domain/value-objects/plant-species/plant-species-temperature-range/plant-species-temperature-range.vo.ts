import { INumericRange } from '@/shared/domain/interfaces/numeric-range.interface';
import { NumericRangeValueObject } from '@/shared/domain/value-objects/numeric-range/numeric-range.vo';

/**
 * Value object representing the temperature range (min/max in °C) for a plant species.
 */
export class PlantSpeciesTemperatureRangeValueObject extends NumericRangeValueObject {
	constructor(range: INumericRange) {
		super(range);
	}
}
