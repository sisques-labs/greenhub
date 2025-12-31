import { IGrowingUnitEventData } from '@/core/plant-context/domain/events/growing-unit/interfaces/growing-unit-event-data.interface';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

export class GrowingUnitUpdatedEvent extends BaseEvent<IGrowingUnitEventData> {
  /**
   * Constructor
   *
   * @param metadata - The metadata of the event
   * @param data - The data of the event
   */
  constructor(metadata: IEventMetadata, data: IGrowingUnitEventData) {
    super(metadata, data);
  }
}
