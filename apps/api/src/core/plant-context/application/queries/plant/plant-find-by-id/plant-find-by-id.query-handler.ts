import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PlantFindByIdQuery } from '@/core/plant-context/application/queries/plant/plant-find-by-id/plant-find-by-id.query';
import { AssertPlantExistsService } from '@/core/plant-context/application/services/plant/assert-plant-exists/assert-plant-exists.service';
import { PlantEntity } from '@/core/plant-context/domain/entities/plant/plant.entity';

/**
 * Query handler for finding a plant by its ID.
 *
 * @remarks
 * Handles the {@link PlantFindByIdQuery} query and attempts to retrieve
 * a {@link PlantEntity} from the data source using the provided ID.
 *
 * This handler uses {@link AssertPlantExistsService} to verify existence and fetch
 * the corresponding plant entity.
 */
@QueryHandler(PlantFindByIdQuery)
export class PlantFindByIdQueryHandler
  implements IQueryHandler<PlantFindByIdQuery>
{
  /**
   * Logger instance for logging handler actions.
   */
  private readonly logger = new Logger(PlantFindByIdQueryHandler.name);

  /**
   * Creates a new instance of the PlantFindByIdQueryHandler class.
   *
   * @param assertPlantExistsService - Service responsible for verifying and retrieving plant entities.
   */
  constructor(
    private readonly assertPlantExistsService: AssertPlantExistsService,
  ) {}

  /**
   * Executes the {@link PlantFindByIdQuery} to retrieve a plant by its ID.
   *
   * @param query - The {@link PlantFindByIdQuery} containing the ID of the plant.
   * @returns A promise that resolves to the {@link PlantEntity} if found.
   * @throws Will rethrow any errors encountered during service execution.
   */
  async execute(query: PlantFindByIdQuery): Promise<PlantEntity> {
    this.logger.log(`Executing plant find by id query: ${query.id.value}`);

    // 01: Find the plant by id using the assertion service
    return await this.assertPlantExistsService.execute(query.id.value);
  }
}
