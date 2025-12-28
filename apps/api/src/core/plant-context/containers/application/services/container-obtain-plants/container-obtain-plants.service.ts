import { ContainerPlantViewModel } from '@/core/plant-context/containers/domain/view-models/container-plant/container-plant.view-model';
import { FindPlantsByContainerIdQuery } from '@/core/plant-context/plants/application/queries/find-plants-by-container-id/find-plants-by-container-id.query';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { Injectable, Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

/**
 * Service responsible for calculating the number of plants
 * within a specified container.
 *
 * @remarks
 * Uses the {@link QueryBus} to retrieve all plants associated
 * with a given container ID, then returns the count.
 *
 * @implements {@link IBaseService} with `string` as input (containerId)
 * and `number` as output (number of plants).
 */
@Injectable()
export class ContainerObtainPlantsService
  implements IBaseService<string, ContainerPlantViewModel[]>
{
  /**
   * Logger instance used for logging service operations.
   * @private
   */
  private readonly logger = new Logger(ContainerObtainPlantsService.name);

  /**
   * Initializes the service with access to the CQRS QueryBus.
   * @param queryBus - The QueryBus instance for querying plant data.
   */
  constructor(private readonly queryBus: QueryBus) {}

  /**
   * Calculates and returns the number of plants in a specified container.
   *
   * @param containerId - The unique identifier for the container.
   * @returns The number of plants found within the container.
   *
   * @throws May propagate errors from the query bus execution.
   */
  async execute(containerId: string): Promise<ContainerPlantViewModel[]> {
    this.logger.log(
      `Calculating number of plants for container: ${containerId}`,
    );

    const plants: ContainerPlantViewModel[] = await this.queryBus.execute(
      new FindPlantsByContainerIdQuery({ containerId }),
    );

    this.logger.debug(
      `Found ${plants.length} plants for container: ${containerId}`,
    );

    return plants;
  }
}
