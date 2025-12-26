import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IContainerEventData } from '@/shared/domain/events/features/containers/interfaces/container-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

/**
 * Event representing the creation of a container entity.
 *
 * @remarks
 * This event is triggered when a new container is created in the system.
 * It extends the BaseEvent class and provides specific typing for container event data.
 *
 * @extends BaseEvent<IContainerEventData>
 */
export class ContainerCreatedEvent extends BaseEvent<IContainerEventData> {
  /**
   * Creates an instance of ContainerCreatedEvent.
   *
   * @param metadata - Metadata describing the event context.
   * @param data - Data pertaining to the created container.
   */
  constructor(metadata: IEventMetadata, data: IContainerEventData) {
    super(metadata, data);
  }
}
