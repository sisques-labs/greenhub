import { AssertContainerExistsService } from '@/core/plant-context/containers/application/services/assert-container-exists/assert-container-exists.service';
import {
  CONTAINER_WRITE_REPOSITORY_TOKEN,
  ContainerWriteRepository,
} from '@/core/plant-context/containers/domain/repositories/container-write/container-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ContainerUpdateCommand } from './container-update.command';

/**
 * Command handler for updating an existing container.
 *
 * @remarks
 * This handler orchestrates the update of a container aggregate, saves changes to the write repository,
 * and publishes domain events.
 */
@CommandHandler(ContainerUpdateCommand)
export class ContainerUpdateCommandHandler
  implements ICommandHandler<ContainerUpdateCommand>
{
  private readonly logger = new Logger(ContainerUpdateCommandHandler.name);

  constructor(
    @Inject(CONTAINER_WRITE_REPOSITORY_TOKEN)
    private readonly containerWriteRepository: ContainerWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertContainerExistsService: AssertContainerExistsService,
  ) {}

  /**
   * Executes the container update command.
   *
   * @param command - The command to execute
   * @returns void
   */
  async execute(command: ContainerUpdateCommand): Promise<void> {
    this.logger.log(
      `Executing update container command by id: ${command.id.value}`,
    );

    // 01: Find the container by id
    const existingContainer = await this.assertContainerExistsService.execute(
      command.id.value,
    );

    // 02: Update the container
    existingContainer.update(
      {
        name: command.name,
        type: command.type,
      },
      true,
    );

    // 03: Save the container entity
    await this.containerWriteRepository.save(existingContainer);

    // 04: Publish all events
    await this.eventBus.publishAll(existingContainer.getUncommittedEvents());
  }
}
