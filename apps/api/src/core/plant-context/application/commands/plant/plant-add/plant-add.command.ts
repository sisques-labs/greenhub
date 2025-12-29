import { IPlantAddCommandDto } from '@/core/plant-context/application/dtos/commands/plant/plant-add/plant-add-command.dto';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { PlantNameValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-name/plant-name.vo';
import { PlantNotesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-notes/plant-notes.vo';
import { PlantPlantedDateValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-planted-date/plant-planted-date.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-status/plant-status.vo';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

/**
 * Command for adding a new plant to a growing unit.
 *
 * @remarks
 * This command encapsulates the data needed to add a new plant to a growing unit,
 * converting primitives to value objects.
 */
export class PlantAddCommand {
  readonly id: PlantUuidValueObject;
  readonly growingUnitId: GrowingUnitUuidValueObject;
  readonly name: PlantNameValueObject;
  readonly species: PlantSpeciesValueObject;
  readonly plantedDate: PlantPlantedDateValueObject | null;
  readonly notes: PlantNotesValueObject | null;
  readonly status: PlantStatusValueObject;

  constructor(props: IPlantAddCommandDto) {
    this.id = new PlantUuidValueObject();
    this.growingUnitId = new GrowingUnitUuidValueObject(props.growingUnitId);
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
