import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';
import { IFieldChangedEventData } from '@/shared/domain/interfaces/updated-field.interface';

export class PlantSpeciesMatureSizeChangedEvent extends BaseEvent<
	IFieldChangedEventData<{ height: number; width: number }>
> {
	constructor(
		metadata: IEventMetadata,
		data: IFieldChangedEventData<{ height: number; width: number }>,
	) {
		super(metadata, data);
	}
}
