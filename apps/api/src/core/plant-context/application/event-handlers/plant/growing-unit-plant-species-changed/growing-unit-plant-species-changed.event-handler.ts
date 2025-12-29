import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { GrowingUnitViewModelFactory } from '@/core/plant-context/domain/factories/view-models/growing-unit-view-model/growing-unit-view-model.factory';
import {
  GROWING_UNIT_READ_REPOSITORY_TOKEN,
  IGrowingUnitReadRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-read/growing-unit-read.repository';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { GrowingUnitPlantSpeciesChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/plant/field-changed/growing-unit-plant-species-changed/growing-unit-plant-species-changed.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event handler for GrowingUnitPlantSpeciesChangedEvent.
 *
 * @remarks
 * This handler updates the growing unit view model when a plant species is changed,
 * ensuring the read model is synchronized with the write model.
 */
@EventsHandler(GrowingUnitPlantSpeciesChangedEvent)
export class GrowingUnitPlantSpeciesChangedEventHandler
  implements IEventHandler<GrowingUnitPlantSpeciesChangedEvent>
{
  private readonly logger = new Logger(
    GrowingUnitPlantSpeciesChangedEventHandler.name,
  );

  constructor(
    @Inject(GROWING_UNIT_READ_REPOSITORY_TOKEN)
    private readonly growingUnitReadRepository: IGrowingUnitReadRepository,
    private readonly assertGrowingUnitExistsService: AssertGrowingUnitExistsService,
    private readonly growingUnitViewModelFactory: GrowingUnitViewModelFactory,
  ) {}

  /**
   * Handles the GrowingUnitPlantSpeciesChangedEvent event by updating the growing unit view model.
   *
   * @param event - The GrowingUnitPlantSpeciesChangedEvent event to handle
   */
  async handle(event: GrowingUnitPlantSpeciesChangedEvent) {
    this.logger.log(
      `Handling growing unit plant species changed event: ${event.aggregateId}`,
    );

    this.logger.debug(
      `Growing unit plant species changed event data: ${JSON.stringify(event.data)}`,
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
