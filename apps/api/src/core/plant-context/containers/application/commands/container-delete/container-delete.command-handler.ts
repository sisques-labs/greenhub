import { AssertContainerExistsService } from '@/core/plant-context/containers/application/services/assert-container-exists/assert-container-exists.service';
import {
  CONTAINER_WRITE_REPOSITORY_TOKEN,
  ContainerWriteRepository,
} from '@/core/plant-context/containers/domain/repositories/container-write/container-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ContainerDeleteCommand } from './container-delete.command';

/**
 * Command handler for deleting a container.
 *
 * @remarks
 * This handler orchestrates the deletion of a container aggregate, removes it from the write repository,
 * and publishes domain events.
 */
@CommandHandler(ContainerDeleteCommand)
export class ContainerDeleteCommandHandler
  implements ICommandHandler<ContainerDeleteCommand>
{
  private readonly logger = new Logger(ContainerDeleteCommandHandler.name);

  constructor(
    @Inject(CONTAINER_WRITE_REPOSITORY_TOKEN)
    private readonly containerWriteRepository: ContainerWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertContainerExistsService: AssertContainerExistsService,
  ) {}

  /**
   * Executes the container delete command.
   *
   * @param command - The command to execute
   * @returns void
   */
  async execute(command: ContainerDeleteCommand): Promise<void> {
    this.logger.log(
      `Executing delete container command by id: ${command.id.value}`,
    );

    // 01: Find the container by id
    const existingContainer = await this.assertContainerExistsService.execute(
      command.id.value,
    );

    // 02: Delete the container
    existingContainer.delete();

    // 03: Delete the container entity
    await this.containerWriteRepository.delete(existingContainer.id.value);

    // 04: Publish all events
    await this.eventBus.publishAll(existingContainer.getUncommittedEvents());
  }
}
