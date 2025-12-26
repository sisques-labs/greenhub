import { IContainerCreateViewModelDto } from '@/features/containers/domain/dtos/view-models/container-create/container-create-view-model.dto';

/**
 * Represents the view model structure for updating a container entity.
 *
 * @remarks
 * This type defines the allowed properties when updating a container from the presentation layer. All properties
 * are optional and formatted as primitives or nullable primitives, and the `id`, `createdAt`, and `updatedAt`
 * properties are omitted as they are not meant to be updated via this DTO.
 *
 * @see IContainerCreateViewModelDto for the full container creation view model
 */
export type IContainerUpdateViewModelDto = Partial<
  Omit<IContainerCreateViewModelDto, 'id' | 'createdAt' | 'updatedAt'>
>;
