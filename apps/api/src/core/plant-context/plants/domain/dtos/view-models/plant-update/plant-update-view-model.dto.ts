import { IPlantCreateViewModelDto } from '@/core/plant-context/plants/domain/dtos/view-models/plant-create/plant-create-view-model.dto';

/**
 * Represents the view model structure for updating a plant entity.
 *
 * @remarks
 * This type defines the allowed properties when updating a plant from the presentation layer. All properties
 * are optional and formatted as primitives or nullable primitives, and the `id`, `createdAt`, and `updatedAt`
 * properties are omitted as they are not meant to be updated via this DTO.
 *
 * @see IPlantCreateViewModelDto for the full plant creation view model
 */
export type IPlantUpdateViewModelDto = Partial<
  Omit<IPlantCreateViewModelDto, 'id' | 'createdAt' | 'updatedAt'>
>;
