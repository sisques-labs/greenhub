import { GrowingUnitCreatedEvent } from '@/core/plant-context/application/events/growing-unit/growing-unit-created/growing-unit-created.event';
import { GrowingUnitDeletedEvent } from '@/core/plant-context/application/events/growing-unit/growing-unit-deleted/growing-unit-deleted.event';
import { GrowingUnitUpdatedEvent } from '@/core/plant-context/application/events/growing-unit/growing-unit-updated/growing-unit-updated.event';
import { PlantCreatedEvent } from '@/core/plant-context/application/events/plant/plant-created/plant-created.event';
import { PlantDeletedEvent } from '@/core/plant-context/application/events/plant/plant-deleted/plant-deleted.event';
import { PlantUpdatedEvent } from '@/core/plant-context/application/events/plant/plant-updated/plant-updated.event';
import { OverviewCalculateService } from '@/generic/overview/application/services/overview-calculate/overview-calculate.service';
import {
  IOverviewReadRepository,
  OVERVIEW_READ_REPOSITORY_TOKEN,
} from '@/generic/overview/domain/repositories/overview-read/overview-read.repository';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

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
  GrowingUnitUpdatedEvent,
  GrowingUnitDeletedEvent,
  PlantCreatedEvent,
  PlantUpdatedEvent,
  PlantDeletedEvent,
)
export class OverviewUpdatedEventHandler
  implements
    IEventHandler<
      | GrowingUnitCreatedEvent
      | GrowingUnitUpdatedEvent
      | GrowingUnitDeletedEvent
      | PlantCreatedEvent
      | PlantUpdatedEvent
      | PlantDeletedEvent
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
      | GrowingUnitUpdatedEvent
      | PlantCreatedEvent
      | PlantUpdatedEvent
      | PlantDeletedEvent,
  ) {
    this.logger.log(
      `Handling overview update event: ${event.eventType} for aggregate ${event.aggregateRootId}`,
    );

    try {
      // TODO: Remove this once we have a better way to ensure the overview is updated after the domain events have been processed
      // 01: Wait a small delay to ensure domain event handlers have updated MongoDB projections
      // This prevents race conditions where the overview is calculated before read models are updated
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 02: Recalculate overview metrics with the constant ID
      const updatedOverview = await this.overviewCalculateService.execute(
        this.OVERVIEW_ID,
      );

      // 03: Save the updated overview view model
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
