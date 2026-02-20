import { INumericRange } from '@/shared/domain/interfaces/numeric-range.interface';

/**
 * NumericRange Value Object
 * Base class for value objects representing a numeric range with min and max bounds.
 * Subclasses can override `validate()` to add domain-specific constraints.
 */
export class NumericRangeValueObject {
	protected readonly _min: number;
	protected readonly _max: number;

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

	public equals(other: NumericRangeValueObject): boolean {
		return this._min === other._min && this._max === other._max;
	}

	protected validate(): void {
		if (this._min > this._max) {
			throw new Error(
				`Range min (${this._min}) cannot be greater than max (${this._max})`,
			);
		}
	}
}
