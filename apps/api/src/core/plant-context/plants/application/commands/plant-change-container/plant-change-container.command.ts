import { IPlantChangeContainerCommandDto } from '@/core/plant-context/plants/application/dtos/commands/plant-change-container/plant-change-container-command.dto';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/container-uuid/container-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

/**
 * Command for changing a plant's container.
 *
 * @remarks
 * This command encapsulates the data needed to change a plant's container,
 * converting primitives to value objects.
 */
export class PlantChangeContainerCommand {
  readonly id: PlantUuidValueObject;
  readonly newContainerId: ContainerUuidValueObject;

  constructor(props: IPlantChangeContainerCommandDto) {
    this.id = new PlantUuidValueObject(props.id);
    this.newContainerId = new ContainerUuidValueObject(props.newContainerId);
  }
}
