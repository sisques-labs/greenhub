import { FindPlantsViewModelByContainerIdQuery } from '@/core/plant-context/plants/application/queries/find-plants-view-model-by-container-id/find-plants-view-model-by-container-id.query';
import {
  PLANT_READ_REPOSITORY_TOKEN,
  PlantReadRepository,
} from '@/core/plant-context/plants/domain/repositories/plant-read/plant-read.repository';
import { PlantViewModel } from '@/core/plant-context/plants/domain/view-models/plant.view-model';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

/**
 * Query handler for finding plant view models by container ID.
 *
 * @remarks
 * This handler executes the query to retrieve plant view models by container ID.
 */
@QueryHandler(FindPlantsViewModelByContainerIdQuery)
export class FindPlantsViewModelByContainerIdQueryHandler
  implements IQueryHandler<FindPlantsViewModelByContainerIdQuery>
{
  private readonly logger = new Logger(
    FindPlantsViewModelByContainerIdQueryHandler.name,
  );

  constructor(
    @Inject(PLANT_READ_REPOSITORY_TOKEN)
    private readonly plantReadRepository: PlantReadRepository,
  ) {}

  /**
   * Executes the FindPlantsViewModelByContainerIdQuery query.
   *
   * @param query - The FindPlantsViewModelByContainerIdQuery query to execute
   * @returns An array of PlantViewModel instances if found
   */
  async execute(
    query: FindPlantsViewModelByContainerIdQuery,
  ): Promise<PlantViewModel[]> {
    this.logger.log(
      `Executing plant view model find by container id query: ${query.containerId.value}`,
    );

    // 01: Find the plant view models by container id
    return await this.plantReadRepository.findByContainerId(
      query.containerId.value,
    );
  }
}
