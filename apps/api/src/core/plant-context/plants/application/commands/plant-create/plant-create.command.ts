import { IPlantCreateCommandDto } from '@/core/plant-context/plants/application/dtos/commands/plant-create/plant-create-command.dto';
import { PlantStatusEnum } from '@/core/plant-context/plants/domain/enums/plant-status/plant-status.enum';
import { PlantNameValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-name/plant-name.vo';
import { PlantNotesValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-notes/plant-notes.vo';
import { PlantPlantedDateValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-planted-date/plant-planted-date.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-status/plant-status.vo';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/container-uuid/container-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

/**
 * Command for creating a new plant.
 *
 * @remarks
 * This command encapsulates the data needed to create a plant aggregate,
 * converting primitives to value objects.
 */
export class PlantCreateCommand {
  readonly id: PlantUuidValueObject;
  readonly containerId: ContainerUuidValueObject;
  readonly name: PlantNameValueObject;
  readonly species: PlantSpeciesValueObject;
  readonly plantedDate: PlantPlantedDateValueObject | null;
  readonly notes: PlantNotesValueObject | null;
  readonly status: PlantStatusValueObject;

  constructor(props: IPlantCreateCommandDto) {
    this.id = new PlantUuidValueObject();
    this.containerId = new ContainerUuidValueObject(props.containerId);

    this.name = new PlantNameValueObject(props.name);
    this.species = new PlantSpeciesValueObject(props.species);

    this.plantedDate = props.plantedDate
      ? new PlantPlantedDateValueObject(props.plantedDate)
      : null;

    this.notes = props.notes ? new PlantNotesValueObject(props.notes) : null;

    this.status = new PlantStatusValueObject(
      props.status !== undefined ? props.status : PlantStatusEnum.PLANTED,
    );
  }
}
