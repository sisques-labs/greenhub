import { IContainerUpdateCommandDto } from '@/core/plant-context/containers/application/dtos/commands/container-update/container-update-command.dto';
import { ContainerNameValueObject } from '@/core/plant-context/containers/domain/value-objects/container-name/container-name.vo';
import { ContainerTypeValueObject } from '@/core/plant-context/containers/domain/value-objects/container-type/container-type.vo';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/container-uuid/container-uuid.vo';

/**
 * Command for updating an existing container.
 *
 * @remarks
 * This command encapsulates the data needed to update a container aggregate,
 * converting primitives to value objects.
 */
export class ContainerUpdateCommand {
  readonly id: ContainerUuidValueObject;
  readonly name?: ContainerNameValueObject;
  readonly type?: ContainerTypeValueObject;

  constructor(props: IContainerUpdateCommandDto) {
    this.id = new ContainerUuidValueObject(props.id);
    this.name = props.name
      ? new ContainerNameValueObject(props.name)
      : undefined;
    this.type = props.type
      ? new ContainerTypeValueObject(props.type)
      : undefined;
  }
}
