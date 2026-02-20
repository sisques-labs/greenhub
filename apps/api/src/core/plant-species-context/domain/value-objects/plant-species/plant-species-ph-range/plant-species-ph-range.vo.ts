/**
 * Value object representing the pH range (min/max) for a plant species.
 */
export class PlantSpeciesPhRangeValueObject {
	private readonly _min: number;
	private readonly _max: number;

	constructor(range: { min: number; max: number }) {
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

	public get value(): { min: number; max: number } {
		return { min: this._min, max: this._max };
	}

	public toPrimitives(): { min: number; max: number } {
		return { min: this._min, max: this._max };
	}

	public equals(other: PlantSpeciesPhRangeValueObject): boolean {
		return this._min === other._min && this._max === other._max;
	}

	private validate(): void {
		if (this._min < 0 || this._max > 14) {
			throw new Error(
				`pH range must be between 0 and 14, got min: ${this._min}, max: ${this._max}`,
			);
		}

		if (this._min > this._max) {
			throw new Error(
				`pH range min (${this._min}) cannot be greater than max (${this._max})`,
			);
		}
	}
}
