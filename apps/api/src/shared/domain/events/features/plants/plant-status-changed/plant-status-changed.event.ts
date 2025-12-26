import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IPlantEventData } from '@/shared/domain/events/features/plants/interfaces/plant-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

/**
 * Event representing a change in the status of a plant entity.
 *
 * @remarks
 * This event is triggered when a plant's status is updated.
 * The event's data may contain any subset of the plant data fields except for the 'id',
 * which is always preserved. It extends the BaseEvent class, specifying
 * the data is a partial object omitting the plant ID.
 *
 * @extends BaseEvent<Partial<Omit<IPlantEventData, 'id'>>>
 */
export class PlantStatusChangedEvent extends BaseEvent<
  Partial<Omit<IPlantEventData, 'id'>>
> {
  /**
   * Creates an instance of PlantStatusChangedEvent.
   *
   * @param metadata - Metadata containing contextual information about the event.
   * @param data - Partial data about the plant whose status changed (excluding the 'id' field).
   */
  constructor(
    metadata: IEventMetadata,
    data: Partial<Omit<IPlantEventData, 'id'>>,
  ) {
    super(metadata, data);
  }
}
