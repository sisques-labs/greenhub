import { PlantTransplantCommand } from '@/core/plant-context/application/commands/plant/plant-transplant/plant-transplant.command';
import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import {
  GROWING_UNIT_WRITE_REPOSITORY_TOKEN,
  IGrowingUnitWriteRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-write/growing-unit-write.repository';
import { PlantTransplantService } from '@/core/plant-context/domain/services/plant/plant-transplant/plant-transplant.service';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

/**
 * Handles the {@link PlantTransplantCommand} to transplant a plant from one growing unit to another.
 *
 * @remarks
 * This command handler locates both growing unit aggregates (source and target),
 * uses the TransplantPlantService to perform the transplant operation, saves both aggregates,
 * and publishes domain events.
 *
 * @public
 */
@CommandHandler(PlantTransplantCommand)
export class PlantTransplantCommandHandler
  implements ICommandHandler<PlantTransplantCommand>
{
  /**
   * Logger instance for the handler.
   */
  private readonly logger = new Logger(PlantTransplantCommandHandler.name);

  /**
   * Creates a new instance of {@link PlantTransplantCommandHandler}.
   *
   * @param growingUnitWriteRepository - The write repository for persisting growing unit aggregates.
   * @param eventBus - The event bus for publishing domain events.
   * @param assertGrowingUnitExistsService - Service that ensures the growing units exist.
   * @param transplantPlantService - Service that handles the transplant logic.
   */
  constructor(
    @Inject(GROWING_UNIT_WRITE_REPOSITORY_TOKEN)
    private readonly growingUnitWriteRepository: IGrowingUnitWriteRepository,
    private readonly eventBus: EventBus,
    private readonly assertGrowingUnitExistsService: AssertGrowingUnitExistsService,
    private readonly plantTransplantService: PlantTransplantService,
  ) {}

  /**
   * Executes the {@link PlantTransplantCommand}, transplanting a plant between growing units and persisting changes.
   *
   * @param command - The command containing the source growing unit id, target growing unit id, and plant id.
   * @returns A promise that resolves when the operation and event publication are complete.
   */
  async execute(command: PlantTransplantCommand): Promise<void> {
    this.logger.log(
      `Executing transplant plant command: plant ${command.plantId.value} from growing unit ${command.sourceGrowingUnitId.value} to ${command.targetGrowingUnitId.value}`,
    );

    // 01: Find the source growing unit aggregate
    const sourceGrowingUnitAggregate: GrowingUnitAggregate =
      await this.assertGrowingUnitExistsService.execute(
        command.sourceGrowingUnitId.value,
      );

    // 02: Find the target growing unit aggregate
    const targetGrowingUnitAggregate: GrowingUnitAggregate =
      await this.assertGrowingUnitExistsService.execute(
        command.targetGrowingUnitId.value,
      );

    // 03: Perform the transplant using the domain service
    await this.plantTransplantService.execute({
      sourceGrowingUnit: sourceGrowingUnitAggregate,
      targetGrowingUnit: targetGrowingUnitAggregate,
      plantId: command.plantId.value,
    });

    // 04: Save the source growing unit aggregate
    await this.growingUnitWriteRepository.save(sourceGrowingUnitAggregate);

    // 05: Save the target growing unit aggregate
    await this.growingUnitWriteRepository.save(targetGrowingUnitAggregate);

    // 06: Publish all events from source growing unit
    await this.eventBus.publishAll(
      sourceGrowingUnitAggregate.getUncommittedEvents(),
    );
    await sourceGrowingUnitAggregate.commit();

    // 07: Publish all events from target growing unit
    await this.eventBus.publishAll(
      targetGrowingUnitAggregate.getUncommittedEvents(),
    );
    await targetGrowingUnitAggregate.commit();

    this.logger.log(
      `Successfully transplanted plant ${command.plantId.value} from growing unit ${command.sourceGrowingUnitId.value} to ${command.targetGrowingUnitId.value}`,
    );
  }
}
