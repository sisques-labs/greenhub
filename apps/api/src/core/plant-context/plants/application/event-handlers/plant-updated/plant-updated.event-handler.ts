import { AssertPlantViewModelExistsService } from '@/core/plant-context/plants/application/services/assert-plant-view-model-exists/assert-plant-view-model-exists.service';
import {
  PLANT_READ_REPOSITORY_TOKEN,
  PlantReadRepository,
} from '@/core/plant-context/plants/domain/repositories/plant-read/plant-read.repository';
import { PlantUpdatedEvent } from '@/shared/domain/events/features/plants/plant-updated/plant-updated.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event handler for PlantUpdatedEvent.
 *
 * @remarks
 * This handler updates the plant view model in the read repository when a plant is updated,
 * ensuring the read model is synchronized with the write model.
 */
@EventsHandler(PlantUpdatedEvent)
export class PlantUpdatedEventHandler
  implements IEventHandler<PlantUpdatedEvent>
{
  private readonly logger = new Logger(PlantUpdatedEventHandler.name);

  constructor(
    @Inject(PLANT_READ_REPOSITORY_TOKEN)
    private readonly plantReadRepository: PlantReadRepository,
    private readonly assertPlantViewModelExistsService: AssertPlantViewModelExistsService,
  ) {}

  /**
   * Handles the PlantUpdatedEvent event by updating the plant view model.
   *
   * @param event - The PlantUpdatedEvent event to handle
   */
  async handle(event: PlantUpdatedEvent) {
    this.logger.log(`Handling plant updated event: ${event.aggregateId}`);

    this.logger.debug(
      `Plant updated event data: ${JSON.stringify(event.data)}`,
    );

    const existingPlantViewModel =
      await this.assertPlantViewModelExistsService.execute(event.aggregateId);

    existingPlantViewModel.update({
      name: event.data.name,
      species: event.data.species,
      plantedDate: event.data.plantedDate,
      notes: event.data.notes,
      status: event.data.status,
    });

    await this.plantReadRepository.save(existingPlantViewModel);
  }
}
