import {
  PLANT_READ_REPOSITORY_TOKEN,
  PlantReadRepository,
} from '@/core/plant-context/plants/domain/repositories/plant-read/plant-read.repository';
import { PlantViewModel } from '@/core/plant-context/plants/domain/view-models/plant.view-model';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindPlantsByCriteriaQuery } from './find-plants-by-criteria.query';

/**
 * Query handler for finding plants by criteria.
 *
 * @remarks
 * This handler executes the query to retrieve paginated plant view models based on criteria.
 */
@QueryHandler(FindPlantsByCriteriaQuery)
export class FindPlantsByCriteriaQueryHandler
  implements IQueryHandler<FindPlantsByCriteriaQuery>
{
  private readonly logger = new Logger(FindPlantsByCriteriaQueryHandler.name);

  constructor(
    @Inject(PLANT_READ_REPOSITORY_TOKEN)
    private readonly plantReadRepository: PlantReadRepository,
  ) {}

  /**
   * Executes the FindPlantsByCriteriaQuery query.
   *
   * @param query - The FindPlantsByCriteriaQuery query to execute
   * @returns Paginated result containing plant view models
   */
  async execute(
    query: FindPlantsByCriteriaQuery,
  ): Promise<PaginatedResult<PlantViewModel>> {
    this.logger.log(
      `Executing find plants by criteria query: ${JSON.stringify(query.criteria)}`,
    );

    return await this.plantReadRepository.findByCriteria(query.criteria);
  }
}
