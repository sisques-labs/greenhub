import { IPlantUpdateCommandDto } from "@/core/plant-context/application/dtos/commands/plant/plant-update/plant-update-command.dto";
import { PlantNameValueObject } from "@/core/plant-context/domain/value-objects/plant/plant-name/plant-name.vo";
import { PlantNotesValueObject } from "@/core/plant-context/domain/value-objects/plant/plant-notes/plant-notes.vo";
import { PlantPlantedDateValueObject } from "@/core/plant-context/domain/value-objects/plant/plant-planted-date/plant-planted-date.vo";
import { PlantSpeciesValueObject } from "@/core/plant-context/domain/value-objects/plant/plant-species/plant-species.vo";
import { PlantStatusValueObject } from "@/core/plant-context/domain/value-objects/plant/plant-status/plant-status.vo";
import { PlantUuidValueObject } from "@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo";

/**
 * Command for updating an existing container.
 *
 * @remarks
 * This command encapsulates the data needed to update a container aggregate,
 * converting primitives to value objects.
 */
export class PlantUpdateCommand {
	readonly id: PlantUuidValueObject;
	readonly name?: PlantNameValueObject;
	readonly species?: PlantSpeciesValueObject;
	readonly plantedDate?: PlantPlantedDateValueObject | null;
	readonly notes?: PlantNotesValueObject | null;
	readonly status?: PlantStatusValueObject;

	constructor(props: IPlantUpdateCommandDto) {
		this.id = new PlantUuidValueObject(props.id);
		this.name = props.name ? new PlantNameValueObject(props.name) : undefined;
		this.species = props.species
			? new PlantSpeciesValueObject(props.species)
			: undefined;
		this.plantedDate = props.plantedDate
			? new PlantPlantedDateValueObject(props.plantedDate)
			: null;
		this.notes = props.notes ? new PlantNotesValueObject(props.notes) : null;
		this.status = props.status
			? new PlantStatusValueObject(props.status)
			: undefined;
	}
}
