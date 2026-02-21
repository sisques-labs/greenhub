import { IPlantSpeciesCreateCommandDto } from '../plant-species-create/plant-species-create-command.dto';

/**
 * Data Transfer Object for updating an existing plant species via command layer.
 *
 * @interface IPlantSpeciesUpdateCommandDto
 */
export interface IPlantSpeciesUpdateCommandDto extends Partial<IPlantSpeciesCreateCommandDto> {
	id: string;
}
