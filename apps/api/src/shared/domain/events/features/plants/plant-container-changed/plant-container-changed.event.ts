import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IPlantContainerChangedEventData } from '@/shared/domain/events/features/plants/interfaces/plant-container-changed-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

export class PlantContainerChangedEvent extends BaseEvent<IPlantContainerChangedEventData> {
  /**
   * Constructor
   *
   * @param metadata - The metadata of the event
   * @param data - The data of the event
   */
  constructor(metadata: IEventMetadata, data: IPlantContainerChangedEventData) {
    super(metadata, data);
  }
}
