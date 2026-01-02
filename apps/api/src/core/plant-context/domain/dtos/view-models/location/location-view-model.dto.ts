import { IBaseViewModelDto } from '@/shared/domain/interfaces/base-view-model-dto.interface';

/**
 * Represents the view model for the data returned after creating a location entity.
 *
 * @remarks
 * This interface defines the structure of data tailored for the presentation layer
 * upon the creation of a location. All properties are formatted as primitives or nullable primitives,
 * as appropriate for API responses or presentation logic.
 *
 * @see ILocationDto for entity data structure
 */
export interface ILocationViewModelDto extends IBaseViewModelDto {
	name: string;
	type: string;
	description: string | null;
}
