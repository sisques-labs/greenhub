import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { GrowingUnitViewModelFactory } from '@/core/plant-context/domain/factories/view-models/growing-unit-view-model/growing-unit-view-model.factory';
import {
  GROWING_UNIT_READ_REPOSITORY_TOKEN,
  IGrowingUnitReadRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-read/growing-unit-read.repository';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { GrowingUnitPlantStatusChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/plant/field-changed/growing-unit-plant-status-changed/growing-unit-plant-status-changed.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event handler for GrowingUnitPlantStatusChangedEvent.
 *
 * @remarks
 * This handler updates the growing unit view model when a plant status is changed,
 * ensuring the read model is synchronized with the write model.
 */
@EventsHandler(GrowingUnitPlantStatusChangedEvent)
export class GrowingUnitPlantStatusChangedEventHandler
  implements IEventHandler<GrowingUnitPlantStatusChangedEvent>
{
  private readonly logger = new Logger(
    GrowingUnitPlantStatusChangedEventHandler.name,
  );

  constructor(
    @Inject(GROWING_UNIT_READ_REPOSITORY_TOKEN)
    private readonly growingUnitReadRepository: IGrowingUnitReadRepository,
    private readonly assertGrowingUnitExistsService: AssertGrowingUnitExistsService,
    private readonly growingUnitViewModelFactory: GrowingUnitViewModelFactory,
  ) {}

  /**
   * Handles the GrowingUnitPlantStatusChangedEvent event by updating the growing unit view model.
   *
   * @param event - The GrowingUnitPlantStatusChangedEvent event to handle
   */
  async handle(event: GrowingUnitPlantStatusChangedEvent) {
    this.logger.log(
      `Handling growing unit plant status changed event: ${event.aggregateId}`,
    );

    this.logger.debug(
      `Growing unit plant status changed event data: ${JSON.stringify(event.data)}`,
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
