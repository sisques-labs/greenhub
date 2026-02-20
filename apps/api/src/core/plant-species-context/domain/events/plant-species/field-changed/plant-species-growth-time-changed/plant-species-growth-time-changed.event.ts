import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';
import { IFieldChangedEventData } from '@/shared/domain/interfaces/updated-field.interface';

export class PlantSpeciesGrowthTimeChangedEvent extends BaseEvent<
	IFieldChangedEventData<number>
> {
	constructor(
		metadata: IEventMetadata,
		data: IFieldChangedEventData<number>,
	) {
		super(metadata, data);
	}
}
