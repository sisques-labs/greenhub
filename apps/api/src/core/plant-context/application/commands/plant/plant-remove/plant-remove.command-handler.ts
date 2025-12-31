import { PlantRemoveCommand } from '@/core/plant-context/application/commands/plant/plant-remove/plant-remove.command';
import { PlantDeletedEvent } from '@/core/plant-context/application/events/plant/plant-deleted/plant-deleted.event';
import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import { PlantEntity } from '@/core/plant-context/domain/entities/plant/plant.entity';
import {
  GROWING_UNIT_WRITE_REPOSITORY_TOKEN,
  IGrowingUnitWriteRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-write/growing-unit-write.repository';
import {
  IPlantWriteRepository,
  PLANT_WRITE_REPOSITORY_TOKEN,
} from '@/core/plant-context/domain/repositories/plant/plant-write/plant-write.repository';
import { PublishIntegrationEventsService } from '@/shared/application/services/publish-integration-events/publish-integration-events.service';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

/**
 * Handles the {@link PlantRemoveCommand} to remove a plant from a growing unit.
 *
 * @remarks
 * This command handler locates the growing unit aggregate, finds the plant to remove,
 * removes it from the growing unit, saves the aggregate, and publishes domain events.
 *
 * @public
 */
@CommandHandler(PlantRemoveCommand)
export class PlantRemoveCommandHandler
  implements ICommandHandler<PlantRemoveCommand>
{
  /**
   * Logger instance for the handler.
   */
  private readonly logger = new Logger(PlantRemoveCommandHandler.name);

  /**
   * Creates a new instance of {@link PlantRemoveCommandHandler}.
   *
   * @param growingUnitWriteRepository - The write repository for persisting growing unit aggregates.
   * @param plantWriteRepository - The write repository for persisting plant entities.
   * @param eventBus - The event bus for publishing domain events.
   * @param assertGrowingUnitExistsService - Service that ensures the growing unit exists.
   * @param publishIntegrationEventsService - Service for publishing integration events.
   */
  constructor(
    @Inject(GROWING_UNIT_WRITE_REPOSITORY_TOKEN)
    private readonly growingUnitWriteRepository: IGrowingUnitWriteRepository,
    @Inject(PLANT_WRITE_REPOSITORY_TOKEN)
    private readonly plantWriteRepository: IPlantWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertGrowingUnitExistsService: AssertGrowingUnitExistsService,
    private readonly publishIntegrationEventsService: PublishIntegrationEventsService,
  ) {}

  /**
   * Executes the {@link PlantRemoveCommand}, removing a plant from the growing unit and persisting changes.
   *
   * @param command - The command containing the growing unit id and plant id.
   * @returns A promise that resolves when the operation and event publication are complete.
   */
  async execute(command: PlantRemoveCommand): Promise<void> {
    this.logger.log(
      `Executing remove plant command: plant ${command.plantId.value} from growing unit ${command.growingUnitId.value}`,
    );

    // 01: Find the growing unit aggregate (aggregate root)
    const growingUnitAggregate: GrowingUnitAggregate =
      await this.assertGrowingUnitExistsService.execute(
        command.growingUnitId.value,
      );

    // 02: Find the plant entity in the growing unit
    const plantEntity = growingUnitAggregate.getPlantById(
      command.plantId.value,
    );

    if (!plantEntity) {
      this.logger.warn(
        `Plant ${command.plantId.value} not found in growing unit ${command.growingUnitId.value}`,
      );
      return;
    }

    // 03: Delete the plant from the database
    await this.plantWriteRepository.delete(command.plantId.value);

    // 04: Remove the plant from the growing unit aggregate
    growingUnitAggregate.removePlant(plantEntity);

    // 05: Save the growing unit aggregate
    await this.growingUnitWriteRepository.save(growingUnitAggregate);

    // 06: Publish all domain events
    await this.eventBus.publishAll(growingUnitAggregate.getUncommittedEvents());
    await growingUnitAggregate.commit();

    // 07: Publish the PlantDeletedEvent integration event
    await this.publishIntegrationEventsService.execute(
      new PlantDeletedEvent(
        {
          aggregateRootId: growingUnitAggregate.id.value,
          aggregateRootType: GrowingUnitAggregate.name,
          entityId: plantEntity.id.value,
          entityType: PlantEntity.name,
          eventType: PlantDeletedEvent.name,
        },
        plantEntity.toPrimitives(),
      ),
    );
  }
}
