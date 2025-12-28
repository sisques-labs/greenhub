import { IContainerPlantViewModelDto } from '@/core/plant-context/containers/domain/dtos/view-models/container-plant/container-plant-view-model.dto';
import { BaseViewModel } from '@/shared/domain/view-models/base-view-model/base-view-model';

/**
/**
 * Represents a view model for a container plant within the context of a container.
 *
 * @remarks
 * This view model provides a structured, immutable interface for container plant data
 * to be used in API responses and view logic. All properties are exposed as read-only accessors.
 *
 * @extends BaseViewModel
 *
 * @example
 * ```typescript
 * const model = new ContainerPlantViewModel({
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
 * @public
 */
export class ContainerPlantViewModel extends BaseViewModel {
  /**
   * The name of the plant.
   * @internal
   */
  private _name: string;

  /**
   * The species of the plant.
   * @internal
   */
  private _species: string;

  /**
   * The date the plant was planted, or null if unknown.
   * @internal
   */
  private _plantedDate: Date | null;

  /**
   * Notes associated with the plant, or null if none.
   * @internal
   */
  private _notes: string | null;

  /**
   * The current status of the plant.
   * @internal
   */
  private _status: string;

  /**
   * Creates a new {@link ContainerPlantViewModel}.
   *
   * @param props - The data used for initialization.
   */
  public constructor(props: IContainerPlantViewModelDto) {
    super(props);
    this._name = props.name;
    this._species = props.species;
    this._plantedDate = props.plantedDate;
    this._notes = props.notes;
    this._status = props.status;
  }

  /**
   * Gets the name of the plant.
   *
   * @returns The name of the plant.
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Gets the species of the plant.
   *
   * @returns The species of the plant.
   */
  public get species(): string {
    return this._species;
  }

  /**
   * Gets the date when the plant was planted, or null if unknown.
   *
   * @returns The planted date, or null.
   */
  public get plantedDate(): Date | null {
    return this._plantedDate;
  }

  /**
   * Gets any notes associated with the plant, or null if none.
   *
   * @returns Notes for the plant, or null.
   */
  public get notes(): string | null {
    return this._notes;
  }

  /**
   * Gets the current status of the plant.
   *
   * @returns The plant's status.
   */
  public get status(): string {
    return this._status;
  }

  /**
   * Gets the last update date of the plant entity.
   *
   * @returns The date and time the plant was last updated.
   */
  public get updatedAt(): Date {
    return this._updatedAt;
  }
}
