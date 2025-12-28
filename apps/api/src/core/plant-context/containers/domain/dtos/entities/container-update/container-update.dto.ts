import { IContainerCreateDto } from '@/core/plant-context/containers/domain/dtos/entities/container-create/container-create.dto';

/**
 * Represents the data structure for updating a container entity.
 *
 * @remarks
 * This type is used when updating an existing container in the system. It allows for partial updates,
 * meaning that only the fields to be changed need to be provided, except for the immutable identifier (`id`), which is excluded.
 * The structure is derived from {@link IContainerCreateDto}, omitting 'id'.
 *
 * @see IContainerCreateDto
 */
export type IContainerUpdateDto = Partial<Omit<IContainerCreateDto, 'id'>>;
