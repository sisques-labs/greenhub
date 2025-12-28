import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IContainerEventData } from '@/shared/domain/events/features/containers/interfaces/container-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

export class ContainerUpdatedEvent extends BaseEvent<
  Partial<Omit<IContainerEventData, 'id'>>
> {
  /**
   * Constructor
   *
   * @param metadata - The metadata of the event
   * @param data - The data of the event
   */
  constructor(
    metadata: IEventMetadata,
    data: Partial<Omit<IContainerEventData, 'id'>>,
  ) {
    super(metadata, data);
  }
}
