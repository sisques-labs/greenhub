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
			throw new Error(
				`pH range must be between 0 and 14, got min: ${this._min}, max: ${this._max}`,
			);
		}

		super.validate();
	}
}
