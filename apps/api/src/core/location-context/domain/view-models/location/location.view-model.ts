import type { ILocationViewModelDto } from '@/core/location-context/domain/dtos/view-models/location/location-view-model.dto';
import { BaseViewModel } from '@/shared/domain/view-models/base-view-model/base-view-model';

/**
 * Represents a location view model for the presentation layer.
 *
 * @remarks
 * This class provides a structured, immutable interface for location data used in API responses
 * and view logic. It exposes location properties as read-only fields and provides a method to
 * update the model instance with new data. Mutations through the update method adjust
 * the underlying data and refresh the update timestamp.
 *
 * @example
 * ```typescript
 * const model = new LocationViewModel({
 *   id: 'location-1',
 *   name: 'Living Room',
 *   type: 'ROOM',
 *   description: 'North-facing room with good sunlight',
 *   totalGrowingUnits: 5,
 *   totalPlants: 12,
 *   createdAt: new Date(),
 *   updatedAt: new Date(),
 * });
 * ```
 */
export class LocationViewModel extends BaseViewModel {
	private _name: string;
	private _type: string;
	private _description: string | null;

	/**
	 * Creates a new LocationViewModel instance.
	 *
	 * @param props - The location creation view model data used for initialization
	 */
	constructor(props: ILocationViewModelDto) {
		super(props);
		this._name = props.name;
		this._type = props.type;
		this._description = props.description;
	}

	/**
	 * Gets the location's name.
	 *
	 * @returns The name of the location
	 */
	public get name(): string {
		return this._name;
	}

	/**
	 * Gets the location's type.
	 *
	 * @returns The type of the location
	 */
	public get type(): string {
		return this._type;
	}

	/**
	 * Gets the location's description.
	 *
	 * @returns The description of the location, or null if not set
	 */
	public get description(): string | null {
		return this._description;
	}

	/**
	 * Updates the location view model with new data.
	 *
	 * @param updateData - The partial update view model data for the location
	 * @returns void
	 *
	 * @example
	 * ```typescript
	 * locationViewModel.update({ name: 'Living Room Updated', totalGrowingUnits: 6 });
	 * ```
	 */
	public update(updateData: ILocationViewModelDto): void {
		this._name = updateData.name;
		this._type = updateData.type;
		this._description = updateData.description;

		this._updatedAt = new Date();
	}
}
