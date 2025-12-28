import { AssertPlantExistsService } from '@/core/plant-context/plants/application/services/assert-plant-exists/assert-plant-exists.service';
import { PlantAggregate } from '@/core/plant-context/plants/domain/aggregates/plant.aggregate';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindPlantByIdQuery } from './find-plant-by-id.query';

/**
 * Query handler for finding a plant by ID.
 *
 * @remarks
 * This handler executes the query to retrieve a plant aggregate by its ID.
 */
@QueryHandler(FindPlantByIdQuery)
export class FindPlantByIdQueryHandler
  implements IQueryHandler<FindPlantByIdQuery>
{
  private readonly logger = new Logger(FindPlantByIdQueryHandler.name);

  constructor(
    private readonly assertPlantExistsService: AssertPlantExistsService,
  ) {}

  /**
   * Executes the FindPlantByIdQuery query.
   *
   * @param query - The FindPlantByIdQuery query to execute
   * @returns The PlantAggregate if found
   */
  async execute(query: FindPlantByIdQuery): Promise<PlantAggregate> {
    this.logger.log(`Executing plant find by id query: ${query.id.value}`);

    return await this.assertPlantExistsService.execute(query.id.value);
  }
}
