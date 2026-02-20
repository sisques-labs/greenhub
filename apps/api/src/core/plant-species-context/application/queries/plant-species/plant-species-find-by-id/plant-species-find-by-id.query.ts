import { IPlantSpeciesFindByIdQueryDto } from '@/core/plant-species-context/application/dtos/queries/plant-species/plant-species-find-by-id/plant-species-find-by-id.dto';
import { PlantSpeciesUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-species-uuid/plant-species-uuid.vo';

/**
 * Query for finding a plant species view model by its unique identifier.
 */
export class PlantSpeciesFindByIdQuery {
	readonly id: PlantSpeciesUuidValueObject;

	constructor(props: IPlantSpeciesFindByIdQueryDto) {
		this.id = new PlantSpeciesUuidValueObject(props.id);
	}
}
