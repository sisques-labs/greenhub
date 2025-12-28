import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IContainerEventData } from '@/shared/domain/events/features/containers/interfaces/container-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

/**
 * Container deleted event
 *
 * @class ContainerDeletedEvent
 * @extends {BaseEvent<IContainerEventData>}
 */
export class ContainerDeletedEvent extends BaseEvent<IContainerEventData> {
  /**
   * Constructor
   *
   * @param metadata - The metadata of the event
   * @param data - The data of the event
   */
  constructor(metadata: IEventMetadata, data: IContainerEventData) {
    super(metadata, data);
  }
}
