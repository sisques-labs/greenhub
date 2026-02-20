import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';
import { IFieldChangedEventData } from '@/shared/domain/interfaces/updated-field.interface';

export class PlantSpeciesScientificNameChangedEvent extends BaseEvent<
	IFieldChangedEventData<string>
> {
	constructor(
		metadata: IEventMetadata,
		data: IFieldChangedEventData<string>,
	) {
		super(metadata, data);
	}
}
