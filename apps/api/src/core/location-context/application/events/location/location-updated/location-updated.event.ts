import { ILocationEventData } from '@/core/location-context/domain/events/location/interfaces/location-event-data.interface';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

export class LocationUpdatedEvent extends BaseEvent<ILocationEventData> {
	/**
	 * Constructor
	 *
	 * @param metadata - The metadata of the event
	 * @param data - The data of the event
	 */
	constructor(metadata: IEventMetadata, data: ILocationEventData) {
		super(metadata, data);
	}
}

