import { IPlantEventData } from '@/core/plant-context/domain/events/plant/interfaces/plant-event-data.interface';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

export class PlantUpdatedEvent extends BaseEvent<IPlantEventData> {
  /**
   * Constructor
   *
   * @param metadata - The metadata of the event
   * @param data - The data of the event
   */
  constructor(metadata: IEventMetadata, data: IPlantEventData) {
    super(metadata, data);
  }
}
