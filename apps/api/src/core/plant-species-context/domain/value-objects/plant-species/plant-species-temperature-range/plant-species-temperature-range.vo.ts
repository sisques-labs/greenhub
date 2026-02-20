import { INumericRange } from '@/shared/domain/interfaces/numeric-range.interface';

/**
 * Value object representing the temperature range (min/max in °C) for a plant species.
 */
export class PlantSpeciesTemperatureRangeValueObject {
	private readonly _min: number;
	private readonly _max: number;

	constructor(range: INumericRange) {
		this._min = range.min;
		this._max = range.max;
		this.validate();
	}

	public get min(): number {
		return this._min;
	}

	public get max(): number {
		return this._max;
	}

	public get value(): INumericRange {
		return { min: this._min, max: this._max };
	}

	public toPrimitives(): INumericRange {
		return { min: this._min, max: this._max };
	}

	public equals(other: PlantSpeciesTemperatureRangeValueObject): boolean {
		return this._min === other._min && this._max === other._max;
	}

	private validate(): void {
		if (this._min > this._max) {
			throw new Error(
				`Temperature range min (${this._min}) cannot be greater than max (${this._max})`,
			);
		}
	}
}
