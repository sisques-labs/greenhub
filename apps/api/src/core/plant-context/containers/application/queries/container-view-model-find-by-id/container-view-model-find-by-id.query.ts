import { IContainerViewModelFindByIdQueryDto } from '@/core/plant-context/containers/application/dtos/queries/container-view-model-find-by-id/container-view-model-find-by-id-query.dto';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/container-uuid/container-uuid.vo';

/**
 * Query for finding a container view model by id.
 *
 * @remarks
 * This query encapsulates the data needed to find a container view model by its id.
 */
export class ContainerViewModelFindByIdQuery {
  readonly id: ContainerUuidValueObject;

  constructor(props: IContainerViewModelFindByIdQueryDto) {
    this.id = new ContainerUuidValueObject(props.id);
  }
}
