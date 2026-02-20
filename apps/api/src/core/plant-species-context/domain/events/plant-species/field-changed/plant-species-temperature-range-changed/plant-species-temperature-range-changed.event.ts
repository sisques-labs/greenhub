import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';
import { IFieldChangedEventData } from '@/shared/domain/interfaces/updated-field.interface';

export class PlantSpeciesTemperatureRangeChangedEvent extends BaseEvent<
	IFieldChangedEventData<{ min: number; max: number }>
> {
	constructor(
		metadata: IEventMetadata,
		data: IFieldChangedEventData<{ min: number; max: number }>,
	) {
		super(metadata, data);
	}
}
