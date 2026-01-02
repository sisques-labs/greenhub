import { IPlantViewModelFindByIdQueryDto } from '@/core/plant-context/application/dtos/queries/plant/plant-view-model-find-by-id/growing-unit-view-model-find-by-id.dto';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

/**
 * Query for finding a plant view model by its unique identifier.
 *
 * @remarks
 * This query encapsulates the required data for retrieving a plant view model based on its ID.
 */
export class PlantViewModelFindByIdQuery {
	/**
	 * Unique identifier for the plant.
	 */
	readonly id: PlantUuidValueObject;

	/**
	 * Creates an instance of PlantViewModelFindByIdQuery.
	 *
	 * @param props - The data transfer object containing the plant's ID.
	 */
	constructor(props: IPlantViewModelFindByIdQueryDto) {
		this.id = new PlantUuidValueObject(props.id);
	}
}
