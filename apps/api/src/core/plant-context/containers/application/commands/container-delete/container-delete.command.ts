import { IContainerDeleteCommandDto } from '@/core/plant-context/containers/application/dtos/commands/container-delete/container-delete-command.dto';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/container-uuid/container-uuid.vo';

/**
 * Command for deleting a container.
 *
 * @remarks
 * This command encapsulates the data needed to delete a container aggregate.
 */
export class ContainerDeleteCommand {
  readonly id: ContainerUuidValueObject;

  constructor(props: IContainerDeleteCommandDto) {
    this.id = new ContainerUuidValueObject(props.id);
  }
}
