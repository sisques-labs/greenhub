import { AssertContainerViewModelExistsService } from '@/core/plant-context/containers/application/services/assert-container-view-model-exists/assert-container-view-model-exists.service';
import { ContainerObtainPlantsService } from '@/core/plant-context/containers/application/services/container-obtain-plants/container-obtain-plants.service';
import {
  CONTAINER_READ_REPOSITORY_TOKEN,
  ContainerReadRepository,
} from '@/core/plant-context/containers/domain/repositories/container-read/container-read.repository';
import { PlantDeletedEvent } from '@/shared/domain/events/features/plants/plant-deleted/plant-deleted.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event handler for PlantDeletedEvent in the containers module.
 *
 * @remarks
 * This handler updates the container view model's numberOfPlants when a plant is deleted,
 * ensuring the read model is synchronized.
 */
@EventsHandler(PlantDeletedEvent)
export class PlantDeletedContainerEventHandler
  implements IEventHandler<PlantDeletedEvent>
{
  private readonly logger = new Logger(PlantDeletedContainerEventHandler.name);

  constructor(
    @Inject(CONTAINER_READ_REPOSITORY_TOKEN)
    private readonly containerReadRepository: ContainerReadRepository,
    private readonly assertContainerViewModelExistsService: AssertContainerViewModelExistsService,
    private readonly containerObtainPlantsService: ContainerObtainPlantsService,
  ) {}

  /**
   * Handles the PlantDeletedEvent event by decrementing numberOfPlants in the container.
   *
   * @param event - The PlantDeletedEvent event to handle
   */
  async handle(event: PlantDeletedEvent) {
    this.logger.log(
      `Handling plant deleted event for container update: ${event.aggregateId}`,
    );

    this.logger.debug(
      `Plant deleted event data: ${JSON.stringify(event.data)}`,
    );

    const containerViewModel =
      await this.assertContainerViewModelExistsService.execute(
        event.data.containerId,
      );

    // 03: Obtain the plants for the container
    const plants = await this.containerObtainPlantsService.execute(
      event.data.containerId,
    );

    // 04: Update the container view model with the new number of plants
    containerViewModel.update({
      plants,
      numberOfPlants: plants.length,
    });

    // 05: Save the updated container view model
    await this.containerReadRepository.save(containerViewModel);
  }
}
