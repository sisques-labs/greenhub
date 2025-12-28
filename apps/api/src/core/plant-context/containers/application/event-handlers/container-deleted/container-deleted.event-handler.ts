import {
  CONTAINER_READ_REPOSITORY_TOKEN,
  ContainerReadRepository,
} from '@/core/plant-context/containers/domain/repositories/container-read/container-read.repository';
import { ContainerDeletedEvent } from '@/shared/domain/events/features/containers/container-deleted/container-deleted.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event handler for ContainerDeletedEvent.
 *
 * @remarks
 * This handler deletes the container view model from the read repository,
 * ensuring the read model is synchronized with the write model.
 */
@EventsHandler(ContainerDeletedEvent)
export class ContainerDeletedEventHandler
  implements IEventHandler<ContainerDeletedEvent>
{
  private readonly logger = new Logger(ContainerDeletedEventHandler.name);

  constructor(
    @Inject(CONTAINER_READ_REPOSITORY_TOKEN)
    private readonly containerReadRepository: ContainerReadRepository,
  ) {}

  /**
   * Handles the ContainerDeletedEvent event by deleting the container view model.
   *
   * @param event - The ContainerDeletedEvent event to handle
   */
  async handle(event: ContainerDeletedEvent) {
    this.logger.log(`Handling container deleted event: ${event.aggregateId}`);

    this.logger.debug(
      `Container deleted event data: ${JSON.stringify(event.data)}`,
    );

    // 01: Delete the container view model
    await this.containerReadRepository.delete(event.aggregateId);
  }
}
