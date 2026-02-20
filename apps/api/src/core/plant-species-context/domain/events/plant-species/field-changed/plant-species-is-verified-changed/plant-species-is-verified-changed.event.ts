import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';
import { IFieldChangedEventData } from '@/shared/domain/interfaces/updated-field.interface';

export class PlantSpeciesIsVerifiedChangedEvent extends BaseEvent<
	IFieldChangedEventData<boolean>
> {
	constructor(
		metadata: IEventMetadata,
		data: IFieldChangedEventData<boolean>,
	) {
		super(metadata, data);
	}
}
