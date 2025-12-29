import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { GrowingUnitViewModelFactory } from '@/core/plant-context/domain/factories/view-models/growing-unit-view-model/growing-unit-view-model.factory';
import {
  GROWING_UNIT_READ_REPOSITORY_TOKEN,
  IGrowingUnitReadRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-read/growing-unit-read.repository';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { GrowingUnitTypeChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/growing-unit/field-changed/growing-unit-type-changed/growing-unit-type-changed.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event handler for GrowingUnitTypeChangedEvent.
 *
 * @remarks
 * This handler updates the growing unit view model when the type is changed,
 * ensuring the read model is synchronized with the write model.
 */
@EventsHandler(GrowingUnitTypeChangedEvent)
export class GrowingUnitTypeChangedEventHandler
  implements IEventHandler<GrowingUnitTypeChangedEvent>
{
  private readonly logger = new Logger(GrowingUnitTypeChangedEventHandler.name);

  constructor(
    @Inject(GROWING_UNIT_READ_REPOSITORY_TOKEN)
    private readonly growingUnitReadRepository: IGrowingUnitReadRepository,
    private readonly assertGrowingUnitExistsService: AssertGrowingUnitExistsService,
    private readonly growingUnitViewModelFactory: GrowingUnitViewModelFactory,
  ) {}

  /**
   * Handles the GrowingUnitTypeChangedEvent event by updating the growing unit view model.
   *
   * @param event - The GrowingUnitTypeChangedEvent event to handle
   */
  async handle(event: GrowingUnitTypeChangedEvent) {
    this.logger.log(
      `Handling growing unit type changed event: ${event.aggregateId}`,
    );

    this.logger.debug(
      `Growing unit type changed event data: ${JSON.stringify(event.data)}`,
    );

    // 01: Get the growing unit aggregate to have the complete state
    const growingUnitAggregate =
      await this.assertGrowingUnitExistsService.execute(event.aggregateId);

    // 02: Create the updated growing unit view model from the aggregate
    const growingUnitViewModel: GrowingUnitViewModel =
      this.growingUnitViewModelFactory.fromAggregate(growingUnitAggregate);

    // 03: Save the updated growing unit view model
    await this.growingUnitReadRepository.save(growingUnitViewModel);
  }
}
