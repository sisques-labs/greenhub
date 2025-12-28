import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IPlantEventData } from '@/shared/domain/events/features/plants/interfaces/plant-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

export class PlantUpdatedEvent extends BaseEvent<
  Partial<Omit<IPlantEventData, 'id'>>
> {
  /**
   * Constructor
   *
   * @param metadata - The metadata of the event
   * @param data - The data of the event
   */
  constructor(
    metadata: IEventMetadata,
    data: Partial<Omit<IPlantEventData, 'id'>>,
  ) {
    super(metadata, data);
  }
}
