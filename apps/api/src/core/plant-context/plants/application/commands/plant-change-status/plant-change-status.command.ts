import { IPlantChangeStatusCommandDto } from '@/core/plant-context/plants/application/dtos/commands/plant-change-status/plant-change-status-command.dto';
import { PlantStatusValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-status/plant-status.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

/**
 * Command for changing a plant's status.
 *
 * @remarks
 * This command encapsulates the data needed to change a plant's status,
 * converting primitives to value objects.
 */
export class PlantChangeStatusCommand {
  readonly id: PlantUuidValueObject;
  readonly status: PlantStatusValueObject;

  constructor(props: IPlantChangeStatusCommandDto) {
    this.id = new PlantUuidValueObject(props.id);
    this.status = new PlantStatusValueObject(props.status);
  }
}
