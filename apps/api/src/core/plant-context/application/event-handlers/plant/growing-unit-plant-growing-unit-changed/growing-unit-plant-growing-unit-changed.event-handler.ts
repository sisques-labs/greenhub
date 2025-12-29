import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { GrowingUnitViewModelFactory } from '@/core/plant-context/domain/factories/view-models/growing-unit-view-model/growing-unit-view-model.factory';
import {
  GROWING_UNIT_READ_REPOSITORY_TOKEN,
  IGrowingUnitReadRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-read/growing-unit-read.repository';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { GrowingUnitPlantGrowingUnitChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/plant/field-changed/growing-unit-plant-growing-unit-changed/growing-unit-plant-growing-unit-changed.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event handler for GrowingUnitPlantGrowingUnitChangedEvent.
 *
 * @remarks
 * This handler updates the growing unit view model when a plant's growing unit is changed,
 * ensuring the read model is synchronized with the write model. This event affects both
 * the source and destination growing units.
 */
@EventsHandler(GrowingUnitPlantGrowingUnitChangedEvent)
export class GrowingUnitPlantGrowingUnitChangedEventHandler
  implements IEventHandler<GrowingUnitPlantGrowingUnitChangedEvent>
{
  private readonly logger = new Logger(
    GrowingUnitPlantGrowingUnitChangedEventHandler.name,
  );

  constructor(
    @Inject(GROWING_UNIT_READ_REPOSITORY_TOKEN)
    private readonly growingUnitReadRepository: IGrowingUnitReadRepository,
    private readonly assertGrowingUnitExistsService: AssertGrowingUnitExistsService,
    private readonly growingUnitViewModelFactory: GrowingUnitViewModelFactory,
  ) {}

  /**
   * Handles the GrowingUnitPlantGrowingUnitChangedEvent event by updating both growing unit view models.
   *
   * @param event - The GrowingUnitPlantGrowingUnitChangedEvent event to handle
   */
  async handle(event: GrowingUnitPlantGrowingUnitChangedEvent) {
    this.logger.log(
      `Handling growing unit plant growing unit changed event: ${event.aggregateId}`,
    );

    this.logger.debug(
      `Growing unit plant growing unit changed event data: ${JSON.stringify(event.data)}`,
    );

    // 01: Get the source growing unit aggregate (where the plant was moved from)
    const sourceGrowingUnitAggregate =
      await this.assertGrowingUnitExistsService.execute(event.aggregateId);

    // 02: Create the updated source growing unit view model from the aggregate
    const sourceGrowingUnitViewModel: GrowingUnitViewModel =
      this.growingUnitViewModelFactory.fromAggregate(
        sourceGrowingUnitAggregate,
      );

    // 03: Save the updated source growing unit view model
    await this.growingUnitReadRepository.save(sourceGrowingUnitViewModel);

    // 04: Get the destination growing unit aggregate (where the plant was moved to)
    const destinationGrowingUnitAggregate =
      await this.assertGrowingUnitExistsService.execute(event.data.newValue);

    // 05: Create the updated destination growing unit view model from the aggregate
    const destinationGrowingUnitViewModel: GrowingUnitViewModel =
      this.growingUnitViewModelFactory.fromAggregate(
        destinationGrowingUnitAggregate,
      );

    // 06: Save the updated destination growing unit view model
    await this.growingUnitReadRepository.save(destinationGrowingUnitViewModel);
  }
}
