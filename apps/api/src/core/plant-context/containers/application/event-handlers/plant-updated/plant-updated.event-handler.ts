import { AssertContainerViewModelExistsService } from '@/core/plant-context/containers/application/services/assert-container-view-model-exists/assert-container-view-model-exists.service';
import { ContainerObtainPlantsService } from '@/core/plant-context/containers/application/services/container-obtain-plants/container-obtain-plants.service';
import {
  CONTAINER_READ_REPOSITORY_TOKEN,
  ContainerReadRepository,
} from '@/core/plant-context/containers/domain/repositories/container-read/container-read.repository';
import { PlantUpdatedEvent } from '@/shared/domain/events/features/plants/plant-updated/plant-updated.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event handler for PlantUpdatedEvent in the containers module.
 *
 * @remarks
 * This handler is kept for backward compatibility but does not handle container changes.
 * Container changes are handled by PlantContainerChangedContainerEventHandler.
 * This handler only processes other plant updates that don't affect containers.
 */
@EventsHandler(PlantUpdatedEvent)
export class PlantUpdatedContainerEventHandler
  implements IEventHandler<PlantUpdatedEvent>
{
  private readonly logger = new Logger(PlantUpdatedContainerEventHandler.name);

  constructor(
    private readonly assertContainerViewModelExistsService: AssertContainerViewModelExistsService,
    private readonly containerObtainPlantsService: ContainerObtainPlantsService,
    @Inject(CONTAINER_READ_REPOSITORY_TOKEN)
    private readonly containerReadRepository: ContainerReadRepository,
  ) {}

  /**
   * Handles the PlantUpdatedEvent event.
   *
   * @remarks
   * This handler does nothing as container changes are handled by PlantContainerChangedContainerEventHandler.
   * It's kept for backward compatibility and potential future use.
   *
   * @param event - The PlantUpdatedEvent event to handle
   */
  async handle(event: PlantUpdatedEvent) {
    this.logger.log(
      `Handling plant updated event for container update: ${event.aggregateId}`,
    );

    this.logger.debug(
      `Plant created event data: ${JSON.stringify(event.data)}`,
    );

    // 01: Find the container view model
    const containerViewModel =
      await this.assertContainerViewModelExistsService.execute(
        event.data.containerId,
      );

    // 02: Obtain the plants for the container
    const plants = await this.containerObtainPlantsService.execute(
      event.data.containerId,
    );

    // 03: Update the container view model with the new number of plants
    containerViewModel.update({
      plants,
      numberOfPlants: plants.length,
    });

    // 04: Save the updated container view model
    await this.containerReadRepository.save(containerViewModel);
  }
}
