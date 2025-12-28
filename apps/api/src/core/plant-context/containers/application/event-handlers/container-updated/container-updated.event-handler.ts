import { AssertContainerViewModelExistsService } from '@/core/plant-context/containers/application/services/assert-container-view-model-exists/assert-container-view-model-exists.service';
import {
  CONTAINER_READ_REPOSITORY_TOKEN,
  ContainerReadRepository,
} from '@/core/plant-context/containers/domain/repositories/container-read/container-read.repository';
import { ContainerUpdatedEvent } from '@/shared/domain/events/features/containers/container-updated/container-updated.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event handler for ContainerUpdatedEvent.
 *
 * @remarks
 * This handler updates the container view model in the read repository when a container is updated,
 * ensuring the read model is synchronized with the write model.
 */
@EventsHandler(ContainerUpdatedEvent)
export class ContainerUpdatedEventHandler
  implements IEventHandler<ContainerUpdatedEvent>
{
  private readonly logger = new Logger(ContainerUpdatedEventHandler.name);

  constructor(
    @Inject(CONTAINER_READ_REPOSITORY_TOKEN)
    private readonly containerReadRepository: ContainerReadRepository,
    private readonly assertContainerViewModelExistsService: AssertContainerViewModelExistsService,
  ) {}

  /**
   * Handles the ContainerUpdatedEvent event by updating the container view model.
   *
   * @param event - The ContainerUpdatedEvent event to handle
   */
  async handle(event: ContainerUpdatedEvent) {
    this.logger.log(`Handling container updated event: ${event.aggregateId}`);

    this.logger.debug(
      `Container updated event data: ${JSON.stringify(event.data)}`,
    );

    // 01: Find the existing container view model
    const existingContainerViewModel =
      await this.assertContainerViewModelExistsService.execute(
        event.aggregateId,
      );

    // 02: Update the container view model with the event data
    existingContainerViewModel.update({
      name: event.data.name,
      type: event.data.type,
    });

    // 03: Save the updated container view model
    await this.containerReadRepository.save(existingContainerViewModel);
  }
}
