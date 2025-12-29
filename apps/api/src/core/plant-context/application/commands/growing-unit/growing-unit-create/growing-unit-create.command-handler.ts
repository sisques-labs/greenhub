import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { GrowingUnitCreateCommand } from '@/core/plant-context/application/commands/growing-unit/growing-unit-create/growing-unit-create.command';
import { GrowingUnitAggregateFactory } from '@/core/plant-context/domain/factories/aggregates/growing-unit/growing-unit-aggregate.factory';
import {
  GROWING_UNIT_WRITE_REPOSITORY_TOKEN,
  IGrowingUnitWriteRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-write/growing-unit-write.repository';

/**
 * Command handler for creating a new growing unit.
 *
 * @remarks
 * This handler orchestrates the creation of a growing unit aggregate, saves it to the write repository,
 * and publishes domain events.
 */
@CommandHandler(GrowingUnitCreateCommand)
export class GrowingUnitCreateCommandHandler
  implements ICommandHandler<GrowingUnitCreateCommand>
{
  private readonly logger = new Logger(GrowingUnitCreateCommandHandler.name);

  constructor(
    @Inject(GROWING_UNIT_WRITE_REPOSITORY_TOKEN)
    private readonly growingUnitWriteRepository: IGrowingUnitWriteRepository,
    private readonly eventBus: EventBus,
    private readonly growingUnitAggregateFactory: GrowingUnitAggregateFactory,
  ) {}

  /**
   * Executes the growing unit create command
   *
   * @param command - The command to execute
   * @returns The created growing unit id
   */
  async execute(command: GrowingUnitCreateCommand): Promise<string> {
    this.logger.log(`Executing growing unit create command: ${command}`);

    // 01: Create the growing unit entity
    const growingUnit = this.growingUnitAggregateFactory.create({
      ...command,
      plants: [],
    });

    // 02: Save the growing unit entity
    await this.growingUnitWriteRepository.save(growingUnit);

    // 03: Publish all events
    await this.eventBus.publishAll(growingUnit.getUncommittedEvents());

    // 04: Return the growing unit id
    return growingUnit.id.value;
  }
}
