import { ContainerViewModelFactory } from '@/core/plant-context/containers/domain/factories/container-view-model/container-view-model.factory';
import {
  CONTAINER_READ_REPOSITORY_TOKEN,
  ContainerReadRepository,
} from '@/core/plant-context/containers/domain/repositories/container-read/container-read.repository';
import { ContainerViewModel } from '@/core/plant-context/containers/domain/view-models/container/container.view-model';
import { ContainerCreatedEvent } from '@/shared/domain/events/features/containers/container-created/container-created.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event handler for ContainerCreatedEvent.
 *
 * @remarks
 * This handler creates a container view model from the event data and saves it to the read repository,
 * ensuring the read model is synchronized with the write model.
 */
@EventsHandler(ContainerCreatedEvent)
export class ContainerCreatedEventHandler
  implements IEventHandler<ContainerCreatedEvent>
{
  private readonly logger = new Logger(ContainerCreatedEventHandler.name);

  constructor(
    @Inject(CONTAINER_READ_REPOSITORY_TOKEN)
    private readonly containerReadRepository: ContainerReadRepository,
    private readonly containerViewModelFactory: ContainerViewModelFactory,
  ) {}

  /**
   * Handles the ContainerCreatedEvent event by creating a new container view model.
   *
   * @param event - The ContainerCreatedEvent event to handle
   */
  async handle(event: ContainerCreatedEvent) {
    this.logger.log(`Handling container created event: ${event.aggregateId}`);

    this.logger.debug(
      `Container created event data: ${JSON.stringify(event.data)}`,
    );

    // 01: Create the container view model
    const containerViewModel: ContainerViewModel =
      this.containerViewModelFactory.fromPrimitives(event.data);

    // 02: Save the container view model
    await this.containerReadRepository.save(containerViewModel);
  }
}
