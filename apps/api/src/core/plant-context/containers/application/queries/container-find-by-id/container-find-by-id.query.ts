import { IContainerFindByIdQueryDto } from '@/core/plant-context/containers/application/dtos/queries/container-find-by-id/container-find-by-id-query.dto';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/container-uuid/container-uuid.vo';

/**
 * Query for finding a container by id.
 *
 * @remarks
 * This query encapsulates the data needed to find a container aggregate by its id.
 */
export class ContainerFindByIdQuery {
  readonly id: ContainerUuidValueObject;

  constructor(props: IContainerFindByIdQueryDto) {
    this.id = new ContainerUuidValueObject(props.id);
  }
}
