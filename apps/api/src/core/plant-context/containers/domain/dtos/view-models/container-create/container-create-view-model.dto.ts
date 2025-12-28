import { ContainerPlantViewModel } from '@/core/plant-context/containers/domain/view-models/container-plant/container-plant.view-model';
import { IBaseViewModelDto } from '@/shared/domain/interfaces/base-view-model-dto.interface';

/**
 * Represents the view model for the data returned after creating a container entity.
 *
 * @remarks
 * This interface defines the structure of data tailored for the presentation layer
 * upon the creation of a container. All properties are formatted as primitives or nullable primitives,
 * as appropriate for API responses or presentation logic.
 *
 * @see IContainerCreateDto for entity data structure
 */
export interface IContainerCreateViewModelDto extends IBaseViewModelDto {
  name: string;
  type: string;
  plants: ContainerPlantViewModel[];
  numberOfPlants: number;
}
