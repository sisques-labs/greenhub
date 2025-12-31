import { PlantDeletedEvent } from '@/core/plant-context/application/events/plant/plant-deleted/plant-deleted.event';
import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { GrowingUnitViewModelFactory } from '@/core/plant-context/domain/factories/view-models/growing-unit-view-model/growing-unit-view-model.factory';
import {
  GROWING_UNIT_READ_REPOSITORY_TOKEN,
  IGrowingUnitReadRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-read/growing-unit-read.repository';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event handler for PlantDeletedEvent.
 *
 * @remarks
 * This handler deletes the growing unit view model when a plant is deleted,
 * ensuring the read model is synchronized with the write model.
 */
@EventsHandler(PlantDeletedEvent)
export class PlantDeletedEventHandler
  implements IEventHandler<PlantDeletedEvent>
{
  private readonly logger = new Logger(PlantDeletedEventHandler.name);

  constructor(
    @Inject(GROWING_UNIT_READ_REPOSITORY_TOKEN)
    private readonly growingUnitReadRepository: IGrowingUnitReadRepository,
    private readonly assertGrowingUnitExistsService: AssertGrowingUnitExistsService,
    private readonly growingUnitViewModelFactory: GrowingUnitViewModelFactory,
  ) {}

  /**
   * Handles the PlantDeletedEvent event by deleting the growing unit view model.
   *
   * @param event - The PlantDeletedEvent event to handle
   */
  async handle(event: PlantDeletedEvent) {
    this.logger.log(`Handling plant deleted event: ${event.entityId}`);

    this.logger.debug(
      `Plant deleted event data: ${JSON.stringify(event.data)}`,
    );

    // 01: Get the growing unit aggregate to have the complete state
    const growingUnitAggregate =
      await this.assertGrowingUnitExistsService.execute(event.data.growingUnitId);

    // 02: Create the updated growing unit view model from the aggregate
    const growingUnitViewModel: GrowingUnitViewModel =
      this.growingUnitViewModelFactory.fromAggregate(growingUnitAggregate);

    // 03: Save the updated growing unit view model
    await this.growingUnitReadRepository.save(growingUnitViewModel);
  }
}
