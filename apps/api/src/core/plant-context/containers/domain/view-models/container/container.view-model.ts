import { IContainerCreateViewModelDto } from '@/core/plant-context/containers/domain/dtos/view-models/container-create/container-create-view-model.dto';
import { IContainerUpdateViewModelDto } from '@/core/plant-context/containers/domain/dtos/view-models/container-update/container-update-view-model.dto';
import { ContainerPlantViewModel } from '@/core/plant-context/containers/domain/view-models/container-plant/container-plant.view-model';
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
 * const model = new ContainerViewModel({
 *   id: 'container-1',
 *   name: 'Garden Bed 1',
 *   type: 'GARDEN_BED',
 *   createdAt: new Date(),
 *   updatedAt: new Date(),
 * });
 * ```
 */
export class ContainerViewModel extends BaseViewModel {
  private _name: string;
  private _type: string;
  private _plants: ContainerPlantViewModel[];
  private _numberOfPlants: number;

  /**
   * Creates a new ContainerViewModel instance.
   *
   * @param props - The container creation view model data used for initialization
   */
  constructor(props: IContainerCreateViewModelDto) {
    super(props);
    this._name = props.name;
    this._type = props.type;
    this._plants = props.plants;
    this._numberOfPlants = props.numberOfPlants;
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
   * Gets the plants in the container.
   *
   * @returns The plants in the container
   */
  public get plants(): ContainerPlantViewModel[] {
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
  public update(updateData: IContainerUpdateViewModelDto): void {
    this._name = updateData.name !== undefined ? updateData.name : this._name;
    this._type = updateData.type !== undefined ? updateData.type : this._type;
    this._plants =
      updateData.plants !== undefined ? updateData.plants : this._plants;
    this._numberOfPlants =
      updateData.numberOfPlants !== undefined
        ? updateData.numberOfPlants
        : this._numberOfPlants;

    this._updatedAt = new Date();
  }
}
