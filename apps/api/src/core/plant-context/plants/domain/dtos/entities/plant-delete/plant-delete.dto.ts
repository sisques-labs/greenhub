import { IPlantCreateDto } from '@/core/plant-context/plants/domain/dtos/entities/plant-create/plant-create.dto';

/**
 * Represents the data required to delete a plant entity.
 *
 * @remarks
 * This type defines the minimal structure needed to request the deletion of a plant from the system,
 * requiring only the plant's unique identifier (`id`). It is a type alias that extracts the `id` property
 * from the {@link IPlantCreateDto}.
 *
 * @see IPlantCreateDto
 */
export type IPlantDeleteDto = Pick<IPlantCreateDto, 'id'>;
