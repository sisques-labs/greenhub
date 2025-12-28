import { AssertPlantViewModelExistsService } from '@/core/plant-context/plants/application/services/assert-plant-view-model-exists/assert-plant-view-model-exists.service';
import {
  PLANT_READ_REPOSITORY_TOKEN,
  PlantReadRepository,
} from '@/core/plant-context/plants/domain/repositories/plant-read/plant-read.repository';
import { PlantDeletedEvent } from '@/shared/domain/events/features/plants/plant-deleted/plant-deleted.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event handler for PlantDeletedEvent.
 *
 * @remarks
 * This handler deletes the plant view model from the read repository when a plant is deleted,
 * ensuring the read model is synchronized with the write model.
 */
@EventsHandler(PlantDeletedEvent)
export class PlantDeletedEventHandler
  implements IEventHandler<PlantDeletedEvent>
{
  private readonly logger = new Logger(PlantDeletedEventHandler.name);

  constructor(
    @Inject(PLANT_READ_REPOSITORY_TOKEN)
    private readonly plantReadRepository: PlantReadRepository,
    private readonly assertPlantViewModelExistsService: AssertPlantViewModelExistsService,
  ) {}

  /**
   * Handles the PlantDeletedEvent event by deleting the plant view model.
   *
   * @param event - The PlantDeletedEvent event to handle
   */
  async handle(event: PlantDeletedEvent) {
    this.logger.log(`Handling plant deleted event: ${event.aggregateId}`);

    const existingPlantViewModel =
      await this.assertPlantViewModelExistsService.execute(event.aggregateId);

    await this.plantReadRepository.delete(existingPlantViewModel.id);
  }
}
