import { ContainerAggregateFactory } from '@/core/plant-context/containers/domain/factories/container-aggregate/container-aggregate.factory';
import {
  CONTAINER_WRITE_REPOSITORY_TOKEN,
  ContainerWriteRepository,
} from '@/core/plant-context/containers/domain/repositories/container-write/container-write.repository';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ContainerCreateCommand } from './container-create.command';

/**
 * Command handler for creating a new container.
 *
 * @remarks
 * This handler orchestrates the creation of a container aggregate, saves it to the write repository,
 * and publishes domain events.
 */
@CommandHandler(ContainerCreateCommand)
export class ContainerCreateCommandHandler
  implements ICommandHandler<ContainerCreateCommand>
{
  private readonly logger = new Logger(ContainerCreateCommandHandler.name);

  constructor(
    @Inject(CONTAINER_WRITE_REPOSITORY_TOKEN)
    private readonly containerWriteRepository: ContainerWriteRepository,
    private readonly eventBus: EventBus,
    private readonly containerAggregateFactory: ContainerAggregateFactory,
  ) {}

  /**
   * Executes the container create command
   *
   * @param command - The command to execute
   * @returns The created container id
   */
  async execute(command: ContainerCreateCommand): Promise<string> {
    this.logger.log(`Executing container create command: ${command}`);

    // 01: Create the container entity
    const now = new Date();
    const container = this.containerAggregateFactory.create(
      {
        ...command,
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      },
      true,
    );

    // 02: Save the container entity
    await this.containerWriteRepository.save(container);

    // 03: Publish all events
    await this.eventBus.publishAll(container.getUncommittedEvents());

    // 04: Return the container id
    return container.id.value;
  }
}
