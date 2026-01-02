import {
	IPlantGrowingUnitReference,
	IPlantViewModelDto,
} from '@/core/plant-context/domain/dtos/view-models/plant/plant-view-model.dto';
import { LocationViewModel } from '@/core/plant-context/domain/view-models/location/location.view-model';
import { BaseViewModel } from '@/shared/domain/view-models/base-view-model/base-view-model';

/**
 * Represents a plant view model for the presentation layer.
 *
 * @remarks
 * This class provides a structured, immutable interface for plant data used in API responses
 * and view logic. It exposes plant properties as read-only fields and provides a method to
 * update the model instance with new data. Mutations through the update method adjust
 * the underlying data and refresh the update timestamp.
 *
 * @example
 * ```typescript
 * const model = new PlantViewModel({
 *   id: 'plant-1',
 *   name: 'Basil',
 *   species: 'Ocimum basilicum',
 *   plantedDate: new Date(),
 *   notes: null,
 *   status: 'PLANTED',
 *   createdAt: new Date(),
 *   updatedAt: new Date(),
 * });
 * ```
 */
export class PlantViewModel extends BaseViewModel {
	private _growingUnitId?: string;
	private _location?: LocationViewModel;
	private _growingUnit?: IPlantGrowingUnitReference;
	private _name: string;
	private _species: string;
	private _plantedDate: Date | null;
	private _notes: string | null;
	private _status: string;

	/**
	 * Creates a new PlantViewModel instance.
	 *
	 * @param props - The plant creation view model data used for initialization
	 */
	constructor(props: IPlantViewModelDto) {
		super(props);
		this._growingUnitId = props.growingUnitId;
		this._location = props.location;
		this._growingUnit = props.growingUnit;
		this._name = props.name;
		this._species = props.species;
		this._plantedDate = props.plantedDate;
		this._notes = props.notes;
		this._status = props.status;
	}

	/**
	 * Gets the growing unit identifier of the plant.
	 *
	 * @returns The growing unit identifier
	 */
	public get growingUnitId(): string | undefined {
		return this._growingUnitId;
	}

	/**
	 * Gets the location view model of the plant.
	 *
	 * @returns The location view model, or undefined if not set
	 */
	public get location(): LocationViewModel | undefined {
		return this._location;
	}

	/**
	 * Gets the growing unit reference of the plant.
	 *
	 * @returns The growing unit reference with basic information, or undefined if not set
	 */
	public get growingUnit(): IPlantGrowingUnitReference | undefined {
		return this._growingUnit;
	}

	/**
	 * Gets the plant's name.
	 *
	 * @returns The name of the plant
	 */
	public get name(): string {
		return this._name;
	}

	/**
	 * Gets the plant's species.
	 *
	 * @returns The species of the plant
	 */
	public get species(): string {
		return this._species;
	}

	/**
	 * Gets the date when the plant was planted.
	 *
	 * @returns The planted date, or null if unknown
	 */
	public get plantedDate(): Date | null {
		return this._plantedDate;
	}

	/**
	 * Gets the plant's status.
	 *
	 * @returns The current status of the plant
	 */
	public get status(): string {
		return this._status;
	}

	/**
	 * Gets any associated notes about the plant.
	 *
	 * @returns Notes for the plant, or null if none
	 */
	public get notes(): string | null {
		return this._notes;
	}

	/**
	 * Updates the plant view model with new data.
	 *
	 * @param updateData - The partial update view model data for the plant
	 * @returns void
	 *
	 * @example
	 * ```typescript
	 * plantViewModel.update({ name: 'Sweet Basil', notes: 'Moved to larger pot' });
	 * ```
	 */
	public update(updateData: IPlantViewModelDto): void {
		this._growingUnitId = updateData.growingUnitId;
		this._location = updateData.location;
		this._growingUnit = updateData.growingUnit;
		this._name = updateData.name;
		this._species = updateData.species;
		this._plantedDate = updateData.plantedDate;
		this._notes = updateData.notes;
		this._status = updateData.status;

		this._updatedAt = new Date();
	}
}
