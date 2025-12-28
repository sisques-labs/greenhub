import { PlantViewModelFactory } from '@/core/plant-context/plants/domain/factories/plant-view-model/plant-view-model.factory';
import {
  PLANT_READ_REPOSITORY_TOKEN,
  PlantReadRepository,
} from '@/core/plant-context/plants/domain/repositories/plant-read/plant-read.repository';
import { PlantViewModel } from '@/core/plant-context/plants/domain/view-models/plant.view-model';
import { PlantCreatedEvent } from '@/shared/domain/events/features/plants/plant-created/plant-created.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event handler for PlantCreatedEvent.
 *
 * @remarks
 * This handler creates a plant view model from the event data and saves it to the read repository,
 * ensuring the read model is synchronized with the write model.
 */
@EventsHandler(PlantCreatedEvent)
export class PlantCreatedEventHandler
  implements IEventHandler<PlantCreatedEvent>
{
  private readonly logger = new Logger(PlantCreatedEventHandler.name);

  constructor(
    @Inject(PLANT_READ_REPOSITORY_TOKEN)
    private readonly plantReadRepository: PlantReadRepository,
    private readonly plantViewModelFactory: PlantViewModelFactory,
  ) {}

  /**
   * Handles the PlantCreatedEvent event by creating a new plant view model.
   *
   * @param event - The PlantCreatedEvent event to handle
   */
  async handle(event: PlantCreatedEvent) {
    this.logger.log(`Handling plant created event: ${event.aggregateId}`);

    this.logger.debug(
      `Plant created event data: ${JSON.stringify(event.data)}`,
    );

    const plantCreatedViewModel: PlantViewModel =
      this.plantViewModelFactory.fromPrimitives(event.data);

    await this.plantReadRepository.save(plantCreatedViewModel);
  }
}
