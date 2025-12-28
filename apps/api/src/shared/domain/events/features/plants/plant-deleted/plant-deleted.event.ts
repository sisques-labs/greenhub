import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IPlantEventData } from '@/shared/domain/events/features/plants/interfaces/plant-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

/**
 * Plant deleted event
 *
 * @class PlantDeletedEvent
 * @extends {BaseEvent<IPlantEventData>}
 */
export class PlantDeletedEvent extends BaseEvent<IPlantEventData> {
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
