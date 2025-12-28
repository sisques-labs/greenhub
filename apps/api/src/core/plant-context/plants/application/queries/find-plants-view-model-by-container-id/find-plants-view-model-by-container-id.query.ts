import { IPlantFindByContainerIdQueryDto } from '@/core/plant-context/plants/application/dtos/queries/find-plants-by-container-id/find-plants-by-container-id-query.dto';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/container-uuid/container-uuid.vo';

/**
 * Query for finding plant view models by container ID.
 *
 * @remarks
 * This query encapsulates the container ID needed to retrieve plant view models.
 */
export class FindPlantsViewModelByContainerIdQuery {
  readonly containerId: ContainerUuidValueObject;

  constructor(props: IPlantFindByContainerIdQueryDto) {
    this.containerId = new ContainerUuidValueObject(props.containerId);
  }
}
