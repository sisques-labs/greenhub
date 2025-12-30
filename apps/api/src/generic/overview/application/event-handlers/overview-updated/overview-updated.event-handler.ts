import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OverviewCalculateService } from '@/generic/overview/application/services/overview-calculate/overview-calculate.service';
import {
  IOverviewReadRepository,
  OVERVIEW_READ_REPOSITORY_TOKEN,
} from '@/generic/overview/domain/repositories/overview-read/overview-read.repository';
import { GrowingUnitCapacityChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/growing-unit/field-changed/growing-unit-capacity-changed/growing-unit-capacity-changed.event';
import { GrowingUnitDimensionsChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/growing-unit/field-changed/growing-unit-dimensions-changed/growing-unit-dimensions-changed.event';
import { GrowingUnitNameChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/growing-unit/field-changed/growing-unit-name-changed/growing-unit-name-changed.event';
import { GrowingUnitTypeChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/growing-unit/field-changed/growing-unit-type-changed/growing-unit-type-changed.event';
import { GrowingUnitCreatedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/growing-unit/growing-unit-created/growing-unit-created.event';
import { GrowingUnitDeletedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/growing-unit/growing-unit-deleted/growing-unit-deleted.event';
import { GrowingUnitPlantAddedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/growing-unit/growing-unit-plant-added/growing-unit-plant-added.event';
import { GrowingUnitPlantRemovedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/growing-unit/growing-unit-plant-removed/growing-unit-plant-removed.event';
import { GrowingUnitPlantGrowingUnitChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/plant/field-changed/growing-unit-plant-growing-unit-changed/growing-unit-plant-growing-unit-changed.event';
import { GrowingUnitPlantNameChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/plant/field-changed/growing-unit-plant-name-changed/growing-unit-plant-name-changed.event';
import { GrowingUnitPlantNotesChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/plant/field-changed/growing-unit-plant-notes-changed/growing-unit-plant-notes-changed.event';
import { GrowingUnitPlantPlantedDateChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/plant/field-changed/growing-unit-plant-planted-date-changed/growing-unit-plant-planted-date-changed.event';
import { GrowingUnitPlantSpeciesChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/plant/field-changed/growing-unit-plant-species-changed/growing-unit-plant-species-changed.event';
import { GrowingUnitPlantStatusChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/plant/field-changed/growing-unit-plant-status-changed/growing-unit-plant-status-changed.event';

/**
 * Event handler that updates the overview view model when plant context events occur.
 *
 * @remarks
 * This handler listens to ALL plant context events and recalculates
 * the overview metrics, updating the single overview view model in the database.
 * It catches any event that might affect the overview metrics to ensure
 * the overview is always up-to-date.
 */
@EventsHandler(
  GrowingUnitCreatedEvent,
  GrowingUnitDeletedEvent,
  GrowingUnitNameChangedEvent,
  GrowingUnitTypeChangedEvent,
  GrowingUnitCapacityChangedEvent,
  GrowingUnitDimensionsChangedEvent,
  GrowingUnitPlantAddedEvent,
  GrowingUnitPlantRemovedEvent,
  GrowingUnitPlantNameChangedEvent,
  GrowingUnitPlantSpeciesChangedEvent,
  GrowingUnitPlantStatusChangedEvent,
  GrowingUnitPlantPlantedDateChangedEvent,
  GrowingUnitPlantNotesChangedEvent,
  GrowingUnitPlantGrowingUnitChangedEvent,
)
export class OverviewUpdatedEventHandler
  implements
    IEventHandler<
      | GrowingUnitCreatedEvent
      | GrowingUnitDeletedEvent
      | GrowingUnitNameChangedEvent
      | GrowingUnitTypeChangedEvent
      | GrowingUnitCapacityChangedEvent
      | GrowingUnitDimensionsChangedEvent
      | GrowingUnitPlantAddedEvent
      | GrowingUnitPlantRemovedEvent
      | GrowingUnitPlantNameChangedEvent
      | GrowingUnitPlantSpeciesChangedEvent
      | GrowingUnitPlantStatusChangedEvent
      | GrowingUnitPlantPlantedDateChangedEvent
      | GrowingUnitPlantNotesChangedEvent
      | GrowingUnitPlantGrowingUnitChangedEvent
    >
{
  private readonly logger = new Logger(OverviewUpdatedEventHandler.name);
  private readonly OVERVIEW_ID = 'overview';

  constructor(
    private readonly overviewCalculateService: OverviewCalculateService,
    @Inject(OVERVIEW_READ_REPOSITORY_TOKEN)
    private readonly overviewReadRepository: IOverviewReadRepository,
  ) {}

  /**
   * Handles plant context events by recalculating and updating the overview view model.
   *
   * @param event - The plant context event that triggered the update
   */
  async handle(
    event:
      | GrowingUnitCreatedEvent
      | GrowingUnitDeletedEvent
      | GrowingUnitNameChangedEvent
      | GrowingUnitTypeChangedEvent
      | GrowingUnitCapacityChangedEvent
      | GrowingUnitDimensionsChangedEvent
      | GrowingUnitPlantAddedEvent
      | GrowingUnitPlantRemovedEvent
      | GrowingUnitPlantNameChangedEvent
      | GrowingUnitPlantSpeciesChangedEvent
      | GrowingUnitPlantStatusChangedEvent
      | GrowingUnitPlantPlantedDateChangedEvent
      | GrowingUnitPlantNotesChangedEvent
      | GrowingUnitPlantGrowingUnitChangedEvent,
  ) {
    this.logger.log(
      `Handling overview update event: ${event.eventType} for aggregate ${event.aggregateId}`,
    );

    try {
      // 01: Recalculate overview metrics with the constant ID
      const updatedOverview = await this.overviewCalculateService.execute(
        this.OVERVIEW_ID,
      );

      // 02: Save the updated overview view model
      await this.overviewReadRepository.save(updatedOverview);

      this.logger.log(
        `Overview view model updated successfully after event: ${event.eventType}`,
      );
    } catch (error) {
      this.logger.error(
        `Error updating overview view model after event ${event.eventType}: ${error.message}`,
        error.stack,
      );
    }
  }
}
