import { InvalidDimensionsException } from '@/shared/domain/exceptions/value-objects/invalid-dimensions/invalid-dimensions.exception';
import { LengthUnitValueObject } from '@/shared/domain/value-objects/length-unit/length-unit.vo';

/**
 * Dimensions Value Object
 * This value object is responsible for encapsulating 3D dimensions (length, width, height)
 * with a unit of measurement and validation and utility methods for calculating volume, area, etc.
 *
 * @example
 * ```typescript
 * const dimensions = new DimensionsValueObject({
 *   length: 10,
 *   width: 5,
 *   height: 3,
 *   unit: LengthUnitEnum.CENTIMETER
 * });
 * dimensions.getVolume(); // 150 (cubic centimeters)
 * dimensions.getBaseArea(); // 50 (square centimeters)
 * dimensions.getSurfaceArea(); // 190 (square centimeters)
 * ```
 */
export class DimensionsValueObject {
	private readonly _length: number;
	private readonly _width: number;
	private readonly _height: number;
	private readonly _unit: LengthUnitValueObject;

	constructor(
		dimensions: {
			length: number | string;
			width: number | string;
			height: number | string;
			unit: string;
		},
		private readonly options: {
			min?: number;
			max?: number;
			allowDecimals?: boolean;
			precision?: number;
		} = {},
	) {
		this.validateRequiredFields(dimensions);
		this._length = this.parseValue(dimensions.length, 'length');
		this._width = this.parseValue(dimensions.width, 'width');
		this._height = this.parseValue(dimensions.height, 'height');
		this._unit = new LengthUnitValueObject(dimensions.unit);
		this.validate();
	}

	/**
	 * Creates a DimensionsValueObject from nullable values.
	 * If all required fields are present, returns a new instance.
	 * If any field is missing, returns null (or throws exception if throwOnInvalid is true).
	 *
	 * @param dimensions - The dimensions data (fields may be null/undefined)
	 * @param options - Options for validation and behavior
	 * @param options.throwOnInvalid - If true, throws exception instead of returning null (default: false)
	 * @param options.min - Minimum value for dimensions
	 * @param options.max - Maximum value for dimensions
	 * @param options.allowDecimals - Whether to allow decimal values
	 * @param options.precision - Maximum number of decimal places
	 * @returns A new DimensionsValueObject if all fields are present, null otherwise
	 * @throws {InvalidDimensionsException} If throwOnInvalid is true and fields are missing
	 */
	public static fromNullable(
		dimensions: {
			length: number | string | null | undefined;
			width: number | string | null | undefined;
			height: number | string | null | undefined;
			unit: string | null | undefined;
		},
		options: {
			throwOnInvalid?: boolean;
			min?: number;
			max?: number;
			allowDecimals?: boolean;
			precision?: number;
		} = {},
	): DimensionsValueObject | null {
		const hasAllFields =
			dimensions.length !== null &&
			dimensions.length !== undefined &&
			dimensions.width !== null &&
			dimensions.width !== undefined &&
			dimensions.height !== null &&
			dimensions.height !== undefined &&
			dimensions.unit !== null &&
			dimensions.unit !== undefined &&
			dimensions.unit.trim() !== '';

		if (!hasAllFields) {
			if (options.throwOnInvalid) {
				const missingFields: string[] = [];
				if (dimensions.length === null || dimensions.length === undefined) {
					missingFields.push('length');
				}
				if (dimensions.width === null || dimensions.width === undefined) {
					missingFields.push('width');
				}
				if (dimensions.height === null || dimensions.height === undefined) {
					missingFields.push('height');
				}
				if (!dimensions.unit || dimensions.unit.trim() === '') {
					missingFields.push('unit');
				}
				throw new InvalidDimensionsException(
					`Missing required fields: ${missingFields.join(', ')}`,
				);
			}
			return null;
		}

		return new DimensionsValueObject(
			{
				length: dimensions.length!,
				width: dimensions.width!,
				height: dimensions.height!,
				unit: dimensions.unit!,
			},
			{
				min: options.min,
				max: options.max,
				allowDecimals: options.allowDecimals,
				precision: options.precision,
			},
		);
	}

	/**
	 * Gets the length dimension.
	 *
	 * @returns The length value
	 */
	public get length(): number {
		return this._length;
	}

	/**
	 * Gets the width dimension.
	 *
	 * @returns The width value
	 */
	public get width(): number {
		return this._width;
	}

	/**
	 * Gets the height dimension.
	 *
	 * @returns The height value
	 */
	public get height(): number {
		return this._height;
	}

	/**
	 * Gets the unit of measurement.
	 *
	 * @returns The unit value object
	 */
	public get unit(): LengthUnitValueObject {
		return this._unit;
	}

	/**
	 * Gets all dimensions as an object.
	 *
	 * @returns An object with length, width, height, and unit
	 */
	public get value(): {
		length: number;
		width: number;
		height: number;
		unit: string;
	} {
		return {
			length: this._length,
			width: this._width,
			height: this._height,
			unit: this._unit.value,
		};
	}

	/**
	 * Calculates the volume (length × width × height).
	 *
	 * @returns The volume in cubic units (e.g., cubic centimeters if unit is CENTIMETER)
	 */
	public getVolume(): number {
		return this._length * this._width * this._height;
	}

	/**
	 * Calculates the base area (length × width).
	 *
	 * @returns The base area in square units (e.g., square centimeters if unit is CENTIMETER)
	 */
	public getBaseArea(): number {
		return this._length * this._width;
	}

	/**
	 * Calculates the total surface area (2 × (length×width + length×height + width×height)).
	 *
	 * @returns The total surface area in square units (e.g., square centimeters if unit is CENTIMETER)
	 */
	public getSurfaceArea(): number {
		const lengthWidth = this._length * this._width;
		const lengthHeight = this._length * this._height;
		const widthHeight = this._width * this._height;
		return 2 * (lengthWidth + lengthHeight + widthHeight);
	}

	/**
	 * Calculates the lateral surface area (2 × (length×height + width×height)).
	 *
	 * @returns The lateral surface area in square units (e.g., square centimeters if unit is CENTIMETER)
	 */
	public getLateralSurfaceArea(): number {
		const lengthHeight = this._length * this._height;
		const widthHeight = this._width * this._height;
		return 2 * (lengthHeight + widthHeight);
	}

	/**
	 * Gets the longest dimension.
	 *
	 * @returns The maximum of length, width, and height
	 */
	public getLongestDimension(): number {
		return Math.max(this._length, this._width, this._height);
	}

	/**
	 * Gets the shortest dimension.
	 *
	 * @returns The minimum of length, width, and height
	 */
	public getShortestDimension(): number {
		return Math.min(this._length, this._width, this._height);
	}

	/**
	 * Checks if the dimensions are equal (cube).
	 *
	 * @returns True if all dimensions are equal
	 */
	public isCube(): boolean {
		return this._length === this._width && this._width === this._height;
	}

	/**
	 * Checks if two dimensions objects are equal.
	 *
	 * @param other - The other dimensions value object to compare
	 * @returns True if all dimensions and unit are equal
	 */
	public equals(other: DimensionsValueObject): boolean {
		return (
			this._length === other._length &&
			this._width === other._width &&
			this._height === other._height &&
			this._unit.equals(other._unit)
		);
	}

	/**
	 * Converts dimensions to primitives.
	 *
	 * @returns An object with length, width, height, and unit
	 */
	public toPrimitives(): {
		length: number;
		width: number;
		height: number;
		unit: string;
	} {
		return {
			length: this._length,
			width: this._width,
			height: this._height,
			unit: this._unit.value,
		};
	}

	private validateRequiredFields(dimensions: {
		length: number | string;
		width: number | string;
		height: number | string;
		unit: string;
	}): void {
		if (dimensions.length === null || dimensions.length === undefined) {
			throw new InvalidDimensionsException('Length is required');
		}

		if (dimensions.width === null || dimensions.width === undefined) {
			throw new InvalidDimensionsException('Width is required');
		}

		if (dimensions.height === null || dimensions.height === undefined) {
			throw new InvalidDimensionsException('Height is required');
		}

		if (!dimensions.unit || dimensions.unit.trim() === '') {
			throw new InvalidDimensionsException('Unit is required');
		}
	}

	private parseValue(value: number | string, dimensionName: string): number {
		if (typeof value === 'string') {
			const parsed = parseFloat(value);
			if (isNaN(parsed)) {
				throw new InvalidDimensionsException(
					`Invalid ${dimensionName} format: ${value}`,
				);
			}
			return parsed;
		}
		return value;
	}

	private validate(): void {
		this.validateDimension(this._length, 'length');
		this.validateDimension(this._width, 'width');
		this.validateDimension(this._height, 'height');
	}

	private validateDimension(value: number, dimensionName: string): void {
		this.checkIsFinite(value, dimensionName);
		this.checkRange(value, dimensionName);
		this.checkDecimals(value, dimensionName);
	}

	private checkIsFinite(value: number, dimensionName: string): void {
		if (!isFinite(value)) {
			throw new InvalidDimensionsException(`${dimensionName} must be finite`);
		}
	}

	private checkRange(value: number, dimensionName: string): void {
		if (this.options.min !== undefined && value < this.options.min) {
			throw new InvalidDimensionsException(
				`${dimensionName} must be at least ${this.options.min}`,
			);
		}

		if (this.options.max !== undefined && value > this.options.max) {
			throw new InvalidDimensionsException(
				`${dimensionName} must be at most ${this.options.max}`,
			);
		}

		if (value <= 0) {
			throw new InvalidDimensionsException(
				`${dimensionName} must be greater than 0`,
			);
		}
	}

	private checkDecimals(value: number, dimensionName: string): void {
		if (this.options.allowDecimals === false && !Number.isInteger(value)) {
			throw new InvalidDimensionsException(
				`${dimensionName} must be an integer`,
			);
		}

		if (this.options.precision !== undefined) {
			const decimalPlaces = (value.toString().split('.')[1] || '').length;
			if (decimalPlaces > this.options.precision) {
				throw new InvalidDimensionsException(
					`${dimensionName} cannot have more than ${this.options.precision} decimal places`,
				);
			}
		}
	}
}
