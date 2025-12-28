import { AssertContainerViewModelExistsService } from '@/core/plant-context/containers/application/services/assert-container-view-model-exists/assert-container-view-model-exists.service';
import { ContainerObtainPlantsService } from '@/core/plant-context/containers/application/services/container-obtain-plants/container-obtain-plants.service';
import {
  CONTAINER_READ_REPOSITORY_TOKEN,
  ContainerReadRepository,
} from '@/core/plant-context/containers/domain/repositories/container-read/container-read.repository';
import { PlantContainerChangedEvent } from '@/shared/domain/events/features/plants/plant-container-changed/plant-container-changed.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event handler for PlantContainerChangedEvent in the containers module.
 *
 * @remarks
 * This handler updates the container view model's numberOfPlants when a plant's container
 * is changed, ensuring the read model is synchronized.
 */
@EventsHandler(PlantContainerChangedEvent)
export class PlantContainerChangedContainerEventHandler
  implements IEventHandler<PlantContainerChangedEvent>
{
  private readonly logger = new Logger(
    PlantContainerChangedContainerEventHandler.name,
  );

  constructor(
    @Inject(CONTAINER_READ_REPOSITORY_TOKEN)
    private readonly containerReadRepository: ContainerReadRepository,
    private readonly assertContainerViewModelExistsService: AssertContainerViewModelExistsService,
    private readonly containerObtainPlantsService: ContainerObtainPlantsService,
  ) {}

  /**
   * Handles the PlantContainerChangedEvent event by updating numberOfPlants in both containers.
   *
   * @param event - The PlantContainerChangedEvent event to handle
   */
  async handle(event: PlantContainerChangedEvent) {
    this.logger.log(
      `Handling plant container changed event: ${event.aggregateId}, from ${event.data.oldContainerId} to ${event.data.newContainerId}`,
    );

    this.logger.debug(
      `Plant container changed event data: ${JSON.stringify(event.data)}`,
    );

    await this.updateContainer(event.data.oldContainerId);
    await this.updateContainer(event.data.newContainerId);
  }

  private async updateContainer(containerId: string) {
    const containerViewModel =
      await this.assertContainerViewModelExistsService.execute(containerId);

    const plants = await this.containerObtainPlantsService.execute(containerId);

    containerViewModel.update({ plants, numberOfPlants: plants.length });

    await this.containerReadRepository.save(containerViewModel);
  }
}
