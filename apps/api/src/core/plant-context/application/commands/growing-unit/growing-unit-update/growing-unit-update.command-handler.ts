import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { GrowingUnitUpdateCommand } from '@/core/plant-context/application/commands/growing-unit/growing-unit-update/growing-unit-update.command';
import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import {
  GROWING_UNIT_WRITE_REPOSITORY_TOKEN,
  IGrowingUnitWriteRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-write/growing-unit-write.repository';

/**
 * Handles the {@link GrowingUnitUpdateCommand} to update an existing growing unit (container) entity.
 *
 * @remarks
 * This command handler locates an existing growing unit aggregate, applies any provided updates,
 * saves the aggregate to the repository, and publishes any resulting domain events.
 *
 * @public
 */
@CommandHandler(GrowingUnitUpdateCommand)
export class GrowingUnitUpdateCommandHandler
  implements ICommandHandler<GrowingUnitUpdateCommand>
{
  /**
   * Logger instance for the handler.
   */
  private readonly logger = new Logger(GrowingUnitUpdateCommandHandler.name);

  /**
   * Creates a new instance of {@link GrowingUnitUpdateCommandHandler}.
   *
   * @param growingUnitWriteRepository - The write repository for persisting growing unit aggregates.
   * @param eventBus - The event bus for publishing domain events.
   * @param assertGrowingUnitExistsService - Service that ensures the target entity exists.
   */
  constructor(
    @Inject(GROWING_UNIT_WRITE_REPOSITORY_TOKEN)
    private readonly growingUnitWriteRepository: IGrowingUnitWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertGrowingUnitExistsService: AssertGrowingUnitExistsService,
  ) {}

  /**
   * Executes the {@link GrowingUnitUpdateCommand}, updating the specified growing unit and
   * persisting changes.
   *
   * @param command - The update command containing the growing unit id and candidate changes.
   * @returns A promise that resolves when the update operation and event publication are complete.
   */
  async execute(command: GrowingUnitUpdateCommand): Promise<void> {
    this.logger.log(
      `Executing update growing unit command by id: ${command.id.value}`,
    );

    // 01: Assert that the growing unit exists by its id.
    const existingGrowingUnit =
      await this.assertGrowingUnitExistsService.execute(command.id.value);

    // 02: Update growing unit properties if new values are provided.
    if (command.name !== undefined) {
      existingGrowingUnit.changeName(command.name);
    }

    if (command.type !== undefined) {
      existingGrowingUnit.changeType(command.type);
    }

    if (command.capacity !== undefined) {
      existingGrowingUnit.changeCapacity(command.capacity);
    }

    if (command.dimensions !== undefined) {
      existingGrowingUnit.changeDimensions(command.dimensions);
    }

    // 03: Save the growing unit entity
    await this.growingUnitWriteRepository.save(existingGrowingUnit);

    // 04: Publish all events
    await this.eventBus.publishAll(existingGrowingUnit.getUncommittedEvents());
    await existingGrowingUnit.commit();
  }
}
