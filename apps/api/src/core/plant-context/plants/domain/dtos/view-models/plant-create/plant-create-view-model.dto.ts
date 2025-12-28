import { IBaseViewModelDto } from '@/shared/domain/interfaces/base-view-model-dto.interface';

/**
 * Represents the view model for the data returned after creating a plant entity.
 *
 * @remarks
 * This interface defines the structure of data tailored for the presentation layer
 * upon the creation of a plant. All properties are formatted as primitives or nullable primitives,
 * as appropriate for API responses or presentation logic.
 *
 * @see IPlantCreateDto for entity data structure
 */
export interface IPlantCreateViewModelDto extends IBaseViewModelDto {
  containerId: string;
  name: string;
  species: string;
  plantedDate: Date | null;
  notes: string | null;
  status: string;
}
