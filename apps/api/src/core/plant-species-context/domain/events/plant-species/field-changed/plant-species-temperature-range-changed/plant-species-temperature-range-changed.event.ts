import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';
import { INumericRange } from '@/shared/domain/interfaces/numeric-range.interface';
import { IFieldChangedEventData } from '@/shared/domain/interfaces/updated-field.interface';

export class PlantSpeciesTemperatureRangeChangedEvent extends BaseEvent<
	IFieldChangedEventData<INumericRange>
> {
	constructor(
		metadata: IEventMetadata,
		data: IFieldChangedEventData<INumericRange>,
	) {
		super(metadata, data);
	}
}
