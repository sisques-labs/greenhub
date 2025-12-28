import { IPlantFindByContainerIdQueryDto } from '@/core/plant-context/plants/application/dtos/queries/find-plants-by-container-id/find-plants-by-container-id-query.dto';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/container-uuid/container-uuid.vo';

/**
 * Query for finding plants by container ID.
 *
 * @remarks
 * This query encapsulates the container ID needed to retrieve plant aggregates.
 */
export class FindPlantsByContainerIdQuery {
  readonly containerId: ContainerUuidValueObject;

  constructor(props: IPlantFindByContainerIdQueryDto) {
    this.containerId = new ContainerUuidValueObject(props.containerId);
  }
}
