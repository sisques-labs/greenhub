import { IGrowingUnitViewModelDto } from '@/core/plant-context/domain/dtos/view-models/growing-unit/growing-unit-view-model.dto';
import { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';
import { DimensionsValueObject } from '@/shared/domain/value-objects/dimensions/dimensions.vo';
import { BaseViewModel } from '@/shared/domain/view-models/base-view-model/base-view-model';

/**
 * Represents a container view model for the presentation layer.
 *
 * @remarks
 * This class provides a structured, immutable interface for container data used in API responses
 * and view logic. It exposes container properties as read-only fields and provides a method to
 * update the model instance with new data. Mutations through the update method adjust
 * the underlying data and refresh the update timestamp.
 *
 * @example
 * ```typescript
 * const model = new GrowingUnitViewModel({
 *   id: 'container-1',
 *   name: 'Garden Bed 1',
 *   type: 'GARDEN_BED',
 *   createdAt: new Date(),
 *   updatedAt: new Date(),
 * });
 * ```
 */
export class GrowingUnitViewModel extends BaseViewModel {
	private _name: string;
	private _type: string;
	private _capacity: number;
	private _dimensions: {
		length: number;
		width: number;
		height: number;
		unit: string;
	} | null;
	private _plants: PlantViewModel[];

	// Calculated properties
	private _remainingCapacity: number;
	private _numberOfPlants: number;
	private _volume: number;

	/**
	 * Creates a new ContainerViewModel instance.
	 *
	 * @param props - The container creation view model data used for initialization
	 */
	constructor(props: IGrowingUnitViewModelDto) {
		super(props);
		this._name = props.name;
		this._type = props.type;
		this._capacity = props.capacity;
		this._dimensions = props.dimensions ?? null;
		this._plants = props.plants;
		this._numberOfPlants = props.numberOfPlants;
		this._remainingCapacity = props.remainingCapacity;
		this._volume = props.volume;

		this.computeCalculatedProperties();
	}

	/**
	 * Computes the calculated properties of the growing unit.
	 */
	private computeCalculatedProperties(): void {
		this._remainingCapacity = this._capacity - this._plants.length;
		this._volume = this._dimensions
			? new DimensionsValueObject(this._dimensions).getVolume()
			: 0;
		this._numberOfPlants = this._plants.length;
	}

	/**
	 * Gets the container's name.
	 *
	 * @returns The name of the container
	 */
	public get name(): string {
		return this._name;
	}

	/**
	 * Gets the container's type.
	 *
	 * @returns The type of the container
	 */
	public get type(): string {
		return this._type;
	}

	/**
	 * Gets the dimensions of the growing unit.
	 *
	 * @returns The dimensions (length, width, height, unit) or null if not set
	 */
	public get dimensions(): {
		length: number;
		width: number;
		height: number;
		unit: string;
	} | null {
		return this._dimensions;
	}

	/**
	 * Gets the plants in the growing unit.
	 *
	 * @returns The plants in the container
	 */
	public get plants(): PlantViewModel[] {
		return this._plants;
	}

	/**
	 * Gets the number of plants in the container.
	 *
	 * @returns The number of plants in the container
	 */
	public get numberOfPlants(): number {
		return this._numberOfPlants;
	}

	/**
	 * Gets the volume of the growing unit.
	 *
	 * @returns The volume in cubic units
	 */
	public get volume(): number {
		return this._volume;
	}
	/**
	 * Gets the capacity of the growing unit.
	 *
	 * @returns The capacity of the growing unit
	 */
	public get capacity(): number {
		return this._capacity;
	}

	/**
	 * Gets the remaining capacity of the growing unit.
	 *
	 * @returns The remaining capacity of the growing unit
	 */
	public get remainingCapacity(): number {
		return this._remainingCapacity;
	}

	/**
	 * Updates the container view model with new data.
	 *
	 * @param updateData - The partial update view model data for the container
	 * @returns void
	 *
	 * @example
	 * ```typescript
	 * containerViewModel.update({ name: 'Garden Bed 2', type: 'POT' });
	 * ```
	 */
	public update(updateData: IGrowingUnitViewModelDto): void {
		this._name = updateData.name;
		this._type = updateData.type;
		this._capacity = updateData.capacity;
		this._dimensions = updateData.dimensions ?? null;
		this._plants = updateData.plants.map((plant) => new PlantViewModel(plant));
		this._numberOfPlants = updateData.numberOfPlants;
		this._remainingCapacity = updateData.remainingCapacity;
		this._volume = updateData.volume;

		this._updatedAt = new Date();
	}
}
