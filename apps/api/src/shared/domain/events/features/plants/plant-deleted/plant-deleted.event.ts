import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IPlantEventData } from '@/shared/domain/events/features/plants/interfaces/plant-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

/**
 * Event representing the deletion of a plant entity.
 *
 * @remarks
 * This event is triggered when a plant is deleted from the system.
 * It extends the BaseEvent class with specific typing for plant event data.
 *
 * @extends BaseEvent<IPlantEventData>
 */
export class PlantDeletedEvent extends BaseEvent<IPlantEventData> {
  /**
   * Creates an instance of PlantDeletedEvent.
   *
   * @param metadata - Metadata describing the context of the event.
   * @param data - Data pertaining to the deleted plant.
   */
  constructor(metadata: IEventMetadata, data: IPlantEventData) {
    super(metadata, data);
  }
}
