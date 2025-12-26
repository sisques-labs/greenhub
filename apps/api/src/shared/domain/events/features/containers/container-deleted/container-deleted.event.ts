import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IContainerEventData } from '@/shared/domain/events/features/containers/interfaces/container-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

/**
 * Event representing the deletion of a container entity.
 *
 * @remarks
 * This event is triggered when a container is deleted from the system.
 * It extends the BaseEvent class with specific typing for container event data.
 *
 * @extends BaseEvent<IContainerEventData>
 */
export class ContainerDeletedEvent extends BaseEvent<IContainerEventData> {
  /**
   * Creates an instance of ContainerDeletedEvent.
   *
   * @param metadata - Metadata describing the context of the event.
   * @param data - Data pertaining to the deleted container.
   */
  constructor(metadata: IEventMetadata, data: IContainerEventData) {
    super(metadata, data);
  }
}
