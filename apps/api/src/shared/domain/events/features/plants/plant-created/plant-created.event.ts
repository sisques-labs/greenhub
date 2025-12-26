import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IPlantEventData } from '@/shared/domain/events/features/plants/interfaces/plant-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

/**
 * Event representing the creation of a plant entity.
 *
 * @remarks
 * This event is triggered when a new plant is created in the system.
 * It extends the BaseEvent class and provides specific typing for plant event data.
 *
 * @extends BaseEvent<IPlantEventData>
 */
export class PlantCreatedEvent extends BaseEvent<IPlantEventData> {
  /**
   * Creates an instance of PlantCreatedEvent.
   *
   * @param metadata - Metadata describing the event context.
   * @param data - Data pertaining to the created plant.
   */
  constructor(metadata: IEventMetadata, data: IPlantEventData) {
    super(metadata, data);
  }
}
