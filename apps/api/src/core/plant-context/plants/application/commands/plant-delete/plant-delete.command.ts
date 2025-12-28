import { IPlantDeleteCommandDto } from '@/core/plant-context/plants/application/dtos/commands/plant-delete/plant-delete-command.dto';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

/**
 * Command for deleting a plant.
 *
 * @remarks
 * This command encapsulates the plant ID needed to delete a plant aggregate.
 */
export class PlantDeleteCommand {
  readonly id: PlantUuidValueObject;

  constructor(props: IPlantDeleteCommandDto) {
    this.id = new PlantUuidValueObject(props.id);
  }
}
