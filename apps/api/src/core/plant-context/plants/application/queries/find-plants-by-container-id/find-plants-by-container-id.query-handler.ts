import { FindPlantsByContainerIdQuery } from '@/core/plant-context/plants/application/queries/find-plants-by-container-id/find-plants-by-container-id.query';
import { PlantAggregate } from '@/core/plant-context/plants/domain/aggregates/plant.aggregate';
import {
  PLANT_WRITE_REPOSITORY_TOKEN,
  PlantWriteRepository,
} from '@/core/plant-context/plants/domain/repositories/plant-write/plant-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

/**
 * Query handler for finding plants by container ID.
 *
 * @remarks
 * This handler executes the query to retrieve plant aggregates by container ID.
 */
@QueryHandler(FindPlantsByContainerIdQuery)
export class FindPlantsByContainerIdQueryHandler
  implements IQueryHandler<FindPlantsByContainerIdQuery>
{
  private readonly logger = new Logger(
    FindPlantsByContainerIdQueryHandler.name,
  );

  constructor(
    @Inject(PLANT_WRITE_REPOSITORY_TOKEN)
    private readonly plantWriteRepository: PlantWriteRepository,
  ) {}

  /**
   * Executes the FindPlantsByContainerIdQuery query.
   *
   * @param query - The FindPlantsByContainerIdQuery query to execute
   * @returns An array of PlantAggregate instances if found
   */
  async execute(
    query: FindPlantsByContainerIdQuery,
  ): Promise<PlantAggregate[]> {
    this.logger.log(
      `Executing plant find by container id query: ${query.containerId.value}`,
    );

    return await this.plantWriteRepository.findByContainerId(
      query.containerId.value,
    );
  }
}
