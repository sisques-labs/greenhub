import { LocationViewModel } from '@/core/plant-context/domain/view-models/location/location.view-model';
import { IBaseViewModelDto } from '@/shared/domain/interfaces/base-view-model-dto.interface';

/**
 * Represents a simplified growing unit reference for plant view models.
 * Contains only basic information without the plants array to avoid circular references.
 */
export interface IPlantGrowingUnitReference {
	id: string;
	name: string;
	type: string;
	capacity: number;
}

/**
 * Represents the view model for the data returned after creating a plant entity.
 *
 * @remarks
 * This interface defines the structure of data tailored for the presentation layer
 * upon the creation of a plant. All properties are formatted as primitives or nullable primitives,
 * as appropriate for API responses or presentation logic.
 *
 * @see IPlantDto for entity data structure
 */
export interface IPlantViewModelDto extends IBaseViewModelDto {
	name: string;
	species: string;
	plantedDate: Date | null;
	notes: string | null;
	status: string;

	growingUnitId?: string;
	location?: LocationViewModel;
	growingUnit?: IPlantGrowingUnitReference;
}
