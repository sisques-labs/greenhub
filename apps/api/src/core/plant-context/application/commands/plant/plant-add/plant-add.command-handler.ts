import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { PlantAddCommand } from '@/core/plant-context/application/commands/plant/plant-add/plant-add.command';
import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import { GrowingUnitFullCapacityException } from '@/core/plant-context/domain/exceptions/growing-unit/growing-unit-full-capacity/growing-unit-full-capacity.exception';
import { PlantEntityFactory } from '@/core/plant-context/domain/factories/entities/plant/plant-entity.factory';
import {
  GROWING_UNIT_WRITE_REPOSITORY_TOKEN,
  IGrowingUnitWriteRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-write/growing-unit-write.repository';

/**
 * Handles the {@link PlantAddCommand} to add a new plant to a growing unit.
 *
 * @remarks
 * This command handler locates the growing unit aggregate, creates a new plant entity,
 * adds it to the growing unit (if capacity allows), saves the aggregate, and publishes domain events.
 *
 * @public
 */
@CommandHandler(PlantAddCommand)
export class PlantAddCommandHandler
  implements ICommandHandler<PlantAddCommand>
{
  /**
   * Logger instance for the handler.
   */
  private readonly logger = new Logger(PlantAddCommandHandler.name);

  /**
   * Creates a new instance of {@link PlantAddCommandHandler}.
   *
   * @param growingUnitWriteRepository - The write repository for persisting growing unit aggregates.
   * @param eventBus - The event bus for publishing domain events.
   * @param assertGrowingUnitExistsService - Service that ensures the growing unit exists.
   * @param plantEntityFactory - Factory for creating plant entities.
   */
  constructor(
    @Inject(GROWING_UNIT_WRITE_REPOSITORY_TOKEN)
    private readonly growingUnitWriteRepository: IGrowingUnitWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertGrowingUnitExistsService: AssertGrowingUnitExistsService,
    private readonly plantEntityFactory: PlantEntityFactory,
  ) {}

  /**
   * Executes the {@link PlantAddCommand}, adding a plant to the growing unit and persisting changes.
   *
   * @param command - The command containing the growing unit id and plant data.
   * @returns A promise that resolves to the created plant id when the operation and event publication are complete.
   */
  async execute(command: PlantAddCommand): Promise<string> {
    this.logger.log(
      `Executing add plant command to growing unit: ${command.growingUnitId.value}`,
    );

    // 01: Find the growing unit aggregate (aggregate root)
    const growingUnitAggregate: GrowingUnitAggregate =
      await this.assertGrowingUnitExistsService.execute(
        command.growingUnitId.value,
      );

    // 02: Check if the growing unit has capacity
    if (!growingUnitAggregate.hasCapacity()) {
      this.logger.error(
        `Growing unit ${command.growingUnitId.value} is at full capacity`,
      );
      throw new GrowingUnitFullCapacityException(command.growingUnitId.value);
    }

    // 03: Create the plant entity
    const plantEntity = this.plantEntityFactory.create({
      id: command.id,
      growingUnitId: command.growingUnitId,
      name: command.name,
      species: command.species,
      plantedDate: command.plantedDate,
      notes: command.notes,
      status: command.status,
    });

    // 04: Add the plant to the growing unit aggregate
    growingUnitAggregate.addPlant(plantEntity);

    // 05: Save the growing unit aggregate
    await this.growingUnitWriteRepository.save(growingUnitAggregate);

    // 06: Publish all events
    await this.eventBus.publishAll(growingUnitAggregate.getUncommittedEvents());
    await growingUnitAggregate.commit();

    // 07: Return the created plant id
    return command.id.value;
  }
}
