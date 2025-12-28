import { AssertPlantViewModelExistsService } from '@/core/plant-context/plants/application/services/assert-plant-view-model-exists/assert-plant-view-model-exists.service';
import {
  PLANT_READ_REPOSITORY_TOKEN,
  PlantReadRepository,
} from '@/core/plant-context/plants/domain/repositories/plant-read/plant-read.repository';
import { PlantStatusChangedEvent } from '@/shared/domain/events/features/plants/plant-status-changed/plant-status-changed.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event handler for PlantStatusChangedEvent.
 *
 * @remarks
 * This handler updates the plant view model status in the read repository when a plant's status changes,
 * ensuring the read model is synchronized with the write model.
 */
@EventsHandler(PlantStatusChangedEvent)
export class PlantStatusChangedEventHandler
  implements IEventHandler<PlantStatusChangedEvent>
{
  private readonly logger = new Logger(PlantStatusChangedEventHandler.name);

  constructor(
    @Inject(PLANT_READ_REPOSITORY_TOKEN)
    private readonly plantReadRepository: PlantReadRepository,
    private readonly assertPlantViewModelExistsService: AssertPlantViewModelExistsService,
  ) {}

  /**
   * Handles the PlantStatusChangedEvent event by updating the plant view model status.
   *
   * @param event - The PlantStatusChangedEvent event to handle
   */
  async handle(event: PlantStatusChangedEvent) {
    this.logger.log(
      `Handling plant status changed event: ${event.aggregateId}`,
    );

    this.logger.debug(
      `Plant status changed event data: ${JSON.stringify(event.data)}`,
    );

    const existingPlantViewModel =
      await this.assertPlantViewModelExistsService.execute(event.aggregateId);

    existingPlantViewModel.update({
      status: event.data.status,
    });

    await this.plantReadRepository.save(existingPlantViewModel);
  }
}
