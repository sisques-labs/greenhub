import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IContainerEventData } from '@/shared/domain/events/features/containers/interfaces/container-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

/**
 * Event representing the update of a container entity.
 *
 * @remarks
 * This event is triggered whenever fields (except for the 'id') of a container are updated.
 * It extends the BaseEvent class and its data represents a partial container, excluding the unique identifier.
 *
 * @extends BaseEvent<Partial<Omit<IContainerEventData, 'id'>>>
 */
export class ContainerUpdatedEvent extends BaseEvent<
  Partial<Omit<IContainerEventData, 'id'>>
> {
  /**
   * Creates an instance of ContainerUpdatedEvent.
   *
   * @param metadata - The metadata context describing the event.
   * @param data - The partial container data that was updated (all fields except the 'id').
   */
  constructor(
    metadata: IEventMetadata,
    data: Partial<Omit<IContainerEventData, 'id'>>,
  ) {
    super(metadata, data);
  }
}
