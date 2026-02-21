import type { IPlantSpeciesDeleteCommandDto } from '@/core/plant-species-context/application/dtos/commands/plant-species/plant-species-delete/plant-species-delete-command.dto';
import { PlantSpeciesUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-species-uuid/plant-species-uuid.vo';

/**
 * Command for deleting a plant species (soft delete).
 *
 * @remarks
 * This command encapsulates the data needed to soft-delete a plant species aggregate.
 */
export class PlantSpeciesDeleteCommand {
	readonly id: PlantSpeciesUuidValueObject;

	constructor(props: IPlantSpeciesDeleteCommandDto) {
		this.id = new PlantSpeciesUuidValueObject(props.id);
	}
}
