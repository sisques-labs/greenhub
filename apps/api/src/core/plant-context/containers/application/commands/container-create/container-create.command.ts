import { IContainerCreateCommandDto } from '@/core/plant-context/containers/application/dtos/commands/container-create/container-create-command.dto';
import { ContainerNameValueObject } from '@/core/plant-context/containers/domain/value-objects/container-name/container-name.vo';
import { ContainerTypeValueObject } from '@/core/plant-context/containers/domain/value-objects/container-type/container-type.vo';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/container-uuid/container-uuid.vo';

/**
 * Command for creating a new container.
 *
 * @remarks
 * This command encapsulates the data needed to create a container aggregate,
 * converting primitives to value objects.
 */
export class ContainerCreateCommand {
  readonly id: ContainerUuidValueObject;
  readonly name: ContainerNameValueObject;
  readonly type: ContainerTypeValueObject;

  constructor(props: IContainerCreateCommandDto) {
    this.id = new ContainerUuidValueObject();
    this.name = new ContainerNameValueObject(props.name);
    this.type = new ContainerTypeValueObject(props.type);
  }
}
