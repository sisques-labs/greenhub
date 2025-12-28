import { AssertContainerViewModelExistsService } from '@/core/plant-context/containers/application/services/assert-container-view-model-exists/assert-container-view-model-exists.service';
import { ContainerObtainPlantsService } from '@/core/plant-context/containers/application/services/container-obtain-plants/container-obtain-plants.service';
import {
  CONTAINER_READ_REPOSITORY_TOKEN,
  ContainerReadRepository,
} from '@/core/plant-context/containers/domain/repositories/container-read/container-read.repository';
import { PlantCreatedEvent } from '@/shared/domain/events/features/plants/plant-created/plant-created.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event handler for PlantCreatedEvent in the containers module.
 *
 * @remarks
 * This handler updates the container view model's numberOfPlants when a plant is created
 * and assigned to a container, ensuring the read model is synchronized.
 */
@EventsHandler(PlantCreatedEvent)
export class PlantCreatedContainerEventHandler
  implements IEventHandler<PlantCreatedEvent>
{
  private readonly logger = new Logger(PlantCreatedContainerEventHandler.name);

  constructor(
    @Inject(CONTAINER_READ_REPOSITORY_TOKEN)
    private readonly containerReadRepository: ContainerReadRepository,
    private readonly assertContainerViewModelExistsService: AssertContainerViewModelExistsService,
    private readonly containerObtainPlantsService: ContainerObtainPlantsService,
  ) {}

  /**
   * Handles the PlantCreatedEvent event by incrementing numberOfPlants in the container.
   *
   * @param event - The PlantCreatedEvent event to handle
   */
  async handle(event: PlantCreatedEvent) {
    this.logger.log(
      `Handling plant created event for container update: ${event.aggregateId}`,
    );

    this.logger.debug(
      `Plant created event data: ${JSON.stringify(event.data)}`,
    );

    // 01: Check if the plant has a containerId
    if (!event.data.containerId) {
      this.logger.debug(
        `Plant ${event.aggregateId} has no containerId, skipping container update`,
      );
      return;
    }

    // 02: Find the container view model
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
