import { IPlantCreateDto } from '@/core/plant-context/plants/domain/dtos/entities/plant-create/plant-create.dto';

/**
 * Represents the data structure for updating a plant entity.
 *
 * @remarks
 * This type is used when updating an existing plant in the system. It allows for partial updates,
 * meaning that only the fields to be changed need to be provided, except for the immutable identifier (`id`), which is excluded.
 * The structure is derived from {@link IPlantCreateDto}, omitting 'id'.
 *
 * @see IPlantCreateDto
 */
export type IPlantUpdateDto = Partial<Omit<IPlantCreateDto, 'id'>>;
