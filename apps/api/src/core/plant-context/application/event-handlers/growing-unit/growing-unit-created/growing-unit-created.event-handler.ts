import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { GrowingUnitViewModelFactory } from '@/core/plant-context/domain/factories/view-models/growing-unit-view-model/growing-unit-view-model.factory';
import {
  GROWING_UNIT_READ_REPOSITORY_TOKEN,
  IGrowingUnitReadRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-read/growing-unit-read.repository';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { GrowingUnitCreatedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/growing-unit/growing-unit-created/growing-unit-created.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event handler for GrowingUnitCreatedEvent.
 *
 * @remarks
 * This handler creates a new growing unit view model when a growing unit is created,
 * ensuring the read model is synchronized with the write model.
 */
@EventsHandler(GrowingUnitCreatedEvent)
export class GrowingUnitCreatedEventHandler
  implements IEventHandler<GrowingUnitCreatedEvent>
{
  private readonly logger = new Logger(GrowingUnitCreatedEventHandler.name);

  constructor(
    @Inject(GROWING_UNIT_READ_REPOSITORY_TOKEN)
    private readonly growingUnitReadRepository: IGrowingUnitReadRepository,
    private readonly assertGrowingUnitExistsService: AssertGrowingUnitExistsService,
    private readonly growingUnitViewModelFactory: GrowingUnitViewModelFactory,
  ) {}

  /**
   * Handles the GrowingUnitCreatedEvent event by creating a new growing unit view model.
   *
   * @param event - The GrowingUnitCreatedEvent event to handle
   */
  async handle(event: GrowingUnitCreatedEvent) {
    this.logger.log(
      `Handling growing unit created event: ${event.aggregateId}`,
    );

    this.logger.debug(
      `Growing unit created event data: ${JSON.stringify(event.data)}`,
    );

    // 01: Get the growing unit aggregate to have the complete state
    const growingUnitAggregate =
      await this.assertGrowingUnitExistsService.execute(event.aggregateId);

    // 02: Create the growing unit view model from the aggregate
    const growingUnitViewModel: GrowingUnitViewModel =
      this.growingUnitViewModelFactory.fromAggregate(growingUnitAggregate);

    // 03: Save the growing unit view model
    await this.growingUnitReadRepository.save(growingUnitViewModel);
  }
}
