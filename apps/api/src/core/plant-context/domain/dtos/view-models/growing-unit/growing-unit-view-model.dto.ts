import { LocationViewModel } from '@/core/plant-context/domain/view-models/location/location.view-model';
import { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';
import { IBaseViewModelDto } from '@/shared/domain/interfaces/base-view-model-dto.interface';

/**
 * Represents the view model for the data returned after creating a plant entity.
 *
 * @remarks
 * This interface defines the structure of data tailored for the presentation layer
 * upon the creation of a plant. All properties are formatted as primitives or nullable primitives,
 * as appropriate for API responses or presentation logic.
 *
 * @see IGrowingUnitDto for entity data structure
 */
export interface IGrowingUnitViewModelDto extends IBaseViewModelDto {
	location: LocationViewModel;
	name: string;
	type: string;
	capacity: number;
	dimensions: {
		length: number;
		width: number;
		height: number;
		unit: string;
	} | null;
	plants: PlantViewModel[];

	// Calculated properties
	remainingCapacity: number;
	numberOfPlants: number;
	volume: number;
}
