import { InvalidPlantSpeciesPhRangeException } from '@/core/plant-species-context/domain/exceptions/plant-species-value-objects/plant-species-invalid-ph-range/plant-species-invalid-ph-range.exception';
import { INumericRange } from '@/shared/domain/interfaces/numeric-range.interface';
import { NumericRangeValueObject } from '@/shared/domain/value-objects/numeric-range/numeric-range.vo';

/**
 * Value object representing the pH range (min/max) for a plant species.
 */
export class PlantSpeciesPhRangeValueObject extends NumericRangeValueObject {
	constructor(range: INumericRange) {
		super(range);
	}

	protected override validate(): void {
		if (this._min < 0 || this._max > 14) {
			throw new InvalidPlantSpeciesPhRangeException(this._min, this._max);
		}

		super.validate();
	}
}
