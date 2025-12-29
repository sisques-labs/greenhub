import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IGrowingUnitPlantEventData } from '@/shared/domain/events/features/plant-context/growing-unit/interfaces/growing-unit-plant-event-data.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

export class GrowingUnitPlantRemovedEvent extends BaseEvent<IGrowingUnitPlantEventData> {
  /**
   * Constructor
   *
   * @param metadata - The metadata of the event
   * @param data - The data of the event
   */
  constructor(metadata: IEventMetadata, data: IGrowingUnitPlantEventData) {
    super(metadata, data);
  }
}
