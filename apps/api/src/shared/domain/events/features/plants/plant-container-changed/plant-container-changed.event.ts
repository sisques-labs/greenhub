import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IPlantContainerChangedEventData } from '@/shared/domain/events/features/plants/interfaces/plant-container-changed-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

/**
 * Event representing the change of container for a plant entity.
 *
 * @remarks
 * This event is triggered when a plant's container is changed. It includes both the old
 * and new container IDs along with all plant data, making it easier for event handlers
 * to update container view models.
 *
 * @extends BaseEvent<IPlantContainerChangedEventData>
 */
export class PlantContainerChangedEvent extends BaseEvent<IPlantContainerChangedEventData> {
  /**
   * Creates an instance of PlantContainerChangedEvent.
   *
   * @param metadata - Metadata describing the event context.
   * @param data - Data pertaining to the container change, including old and new container IDs.
   */
  constructor(metadata: IEventMetadata, data: IPlantContainerChangedEventData) {
    super(metadata, data);
  }
}
