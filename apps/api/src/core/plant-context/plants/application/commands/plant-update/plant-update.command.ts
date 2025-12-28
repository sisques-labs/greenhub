import { IPlantUpdateCommandDto } from '@/core/plant-context/plants/application/dtos/commands/plant-update/plant-update-command.dto';
import { PlantNameValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-name/plant-name.vo';
import { PlantNotesValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-notes/plant-notes.vo';
import { PlantPlantedDateValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-planted-date/plant-planted-date.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-status/plant-status.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

/**
 * Command for updating an existing plant.
 *
 * @remarks
 * This command encapsulates the data needed to update a plant aggregate,
 * converting primitives to value objects. All fields are optional except id.
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

    if (props.name !== undefined) {
      this.name = new PlantNameValueObject(props.name);
    }

    if (props.species !== undefined) {
      this.species = new PlantSpeciesValueObject(props.species);
    }

    if (props.plantedDate !== undefined) {
      this.plantedDate = props.plantedDate
        ? new PlantPlantedDateValueObject(props.plantedDate)
        : null;
    }

    if (props.notes !== undefined) {
      this.notes = props.notes ? new PlantNotesValueObject(props.notes) : null;
    }

    if (props.status !== undefined) {
      this.status = new PlantStatusValueObject(props.status);
    }
  }
}
