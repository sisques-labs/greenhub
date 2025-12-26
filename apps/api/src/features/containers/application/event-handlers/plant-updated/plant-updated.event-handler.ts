import { PlantUpdatedEvent } from '@/shared/domain/events/features/plants/plant-updated/plant-updated.event';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event handler for PlantUpdatedEvent in the containers module.
 *
 * @remarks
 * This handler is kept for backward compatibility but does not handle container changes.
 * Container changes are handled by PlantContainerChangedContainerEventHandler.
 * This handler only processes other plant updates that don't affect containers.
 */
@EventsHandler(PlantUpdatedEvent)
export class PlantUpdatedContainerEventHandler
  implements IEventHandler<PlantUpdatedEvent>
{
  private readonly logger = new Logger(PlantUpdatedContainerEventHandler.name);

  constructor() {}

  /**
   * Handles the PlantUpdatedEvent event.
   *
   * @remarks
   * This handler does nothing as container changes are handled by PlantContainerChangedContainerEventHandler.
   * It's kept for backward compatibility and potential future use.
   *
   * @param event - The PlantUpdatedEvent event to handle
   */
  async handle(event: PlantUpdatedEvent) {
    this.logger.debug(
      `Plant updated event received but container changes are handled by PlantContainerChangedContainerEventHandler: ${event.aggregateId}`,
    );

    // Container changes are handled by PlantContainerChangedContainerEventHandler
    // This handler is kept for backward compatibility
  }
}
