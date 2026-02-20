import { InvalidPlantSpeciesMatureSizeHeightException } from '@/core/plant-species-context/domain/exceptions/plant-species-value-objects/plant-species-invalid-mature-size-height/plant-species-invalid-mature-size-height.exception';
import { InvalidPlantSpeciesMatureSizeWidthException } from '@/core/plant-species-context/domain/exceptions/plant-species-value-objects/plant-species-invalid-mature-size-width/plant-species-invalid-mature-size-width.exception';

/**
 * Value object representing the mature size (height/width in cm) of a plant species.
 */
export class PlantSpeciesMatureSizeValueObject {
	private readonly _height: number;
	private readonly _width: number;

	constructor(size: { height: number; width: number }) {
		this._height = size.height;
		this._width = size.width;
		this.validate();
	}

	public get height(): number {
		return this._height;
	}

	public get width(): number {
		return this._width;
	}

	public get value(): { height: number; width: number } {
		return { height: this._height, width: this._width };
	}

	public toPrimitives(): { height: number; width: number } {
		return { height: this._height, width: this._width };
	}

	public equals(other: PlantSpeciesMatureSizeValueObject): boolean {
		return this._height === other._height && this._width === other._width;
	}

	private validate(): void {
		if (this._height <= 0) {
			throw new InvalidPlantSpeciesMatureSizeHeightException(this._height);
		}

		if (this._width <= 0) {
			throw new InvalidPlantSpeciesMatureSizeWidthException(this._width);
		}
	}
}
