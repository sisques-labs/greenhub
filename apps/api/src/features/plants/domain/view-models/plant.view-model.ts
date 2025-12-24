import { IPlantCreateViewModelDto } from '@/features/plants/domain/dtos/view-models/plant-create/plant-create-view-model.dto';
import { IPlantUpdateViewModelDto } from '@/features/plants/domain/dtos/view-models/plant-update/plant-update-view-model.dto';

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
export class PlantViewModel {
  private readonly _id: string;
  private _name: string;
  private _species: string;
  private _plantedDate: Date | null;
  private _notes: string | null;
  private _status: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  /**
   * Creates a new PlantViewModel instance.
   *
   * @param props - The plant creation view model data used for initialization
   */
  constructor(props: IPlantCreateViewModelDto) {
    this._id = props.id;
    this._name = props.name;
    this._species = props.species;
    this._plantedDate = props.plantedDate;
    this._notes = props.notes;
    this._status = props.status;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  /**
   * Gets the plant's unique identifier.
   *
   * @returns The plant's id
   */
  public get id(): string {
    return this._id;
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
   * Gets the creation date of the plant entity.
   *
   * @returns The date the plant was created
   */
  public get createdAt(): Date {
    return this._createdAt;
  }

  /**
   * Gets the last update date of the plant entity.
   *
   * @returns The date the plant was last updated
   */
  public get updatedAt(): Date {
    return this._updatedAt;
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
  public update(updateData: IPlantUpdateViewModelDto): void {
    this._name = updateData.name !== undefined ? updateData.name : this._name;
    this._species =
      updateData.species !== undefined ? updateData.species : this._species;
    this._plantedDate =
      updateData.plantedDate !== undefined
        ? updateData.plantedDate
        : this._plantedDate;
    this._notes =
      updateData.notes !== undefined ? updateData.notes : this._notes;
    this._status =
      updateData.status !== undefined ? updateData.status : this._status;
    this._updatedAt = new Date();
  }
}
