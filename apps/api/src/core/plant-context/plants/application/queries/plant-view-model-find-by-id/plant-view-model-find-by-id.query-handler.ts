import { AssertPlantViewModelExistsService } from '@/core/plant-context/plants/application/services/assert-plant-view-model-exists/assert-plant-view-model-exists.service';
import { PlantViewModel } from '@/core/plant-context/plants/domain/view-models/plant.view-model';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PlantViewModelFindByIdQuery } from './plant-view-model-find-by-id.query';

/**
 * Query handler for finding a plant view model by ID.
 *
 * @remarks
 * This handler executes the query to retrieve a plant view model by its ID.
 */
@QueryHandler(PlantViewModelFindByIdQuery)
export class PlantViewModelFindByIdQueryHandler
  implements IQueryHandler<PlantViewModelFindByIdQuery>
{
  private readonly logger = new Logger(PlantViewModelFindByIdQueryHandler.name);

  constructor(
    private readonly assertPlantViewModelExistsService: AssertPlantViewModelExistsService,
  ) {}

  /**
   * Executes the PlantViewModelFindByIdQuery query.
   *
   * @param query - The PlantViewModelFindByIdQuery query to execute
   * @returns The PlantViewModel if found
   */
  async execute(query: PlantViewModelFindByIdQuery): Promise<PlantViewModel> {
    this.logger.log(
      `Executing plant view model find by id query: ${query.id.value}`,
    );

    return await this.assertPlantViewModelExistsService.execute(query.id.value);
  }
}
