import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IPlantEventData } from '@/shared/domain/events/features/plants/interfaces/plant-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

/**
 * Event representing the update of a plant entity.
 *
 * @remarks
 * This event is triggered whenever fields (except for the 'id') of a plant are updated.
 * It extends the BaseEvent class and its data represents a partial plant, excluding the unique identifier.
 *
 * @extends BaseEvent<Partial<Omit<IPlantEventData, 'id'>>>
 */
export class PlantUpdatedEvent extends BaseEvent<
  Partial<Omit<IPlantEventData, 'id'>>
> {
  /**
   * Creates an instance of PlantUpdatedEvent.
   *
   * @param metadata - The metadata context describing the event.
   * @param data - The partial plant data that was updated (all fields except the 'id').
   */
  constructor(
    metadata: IEventMetadata,
    data: Partial<Omit<IPlantEventData, 'id'>>,
  ) {
    super(metadata, data);
  }
}
