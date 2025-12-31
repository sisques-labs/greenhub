import { BaseEvent } from "@/shared/domain/events/base-event.interface";
import { IEventMetadata } from "@/shared/domain/interfaces/event-metadata.interface";
import { IFieldChangedEventData } from "@/shared/domain/interfaces/updated-field.interface";

export class PlantPlantedDateChangedEvent extends BaseEvent<
	IFieldChangedEventData<Date | null>
> {
	/**
	 * Constructor
	 *
	 * @param metadata - The metadata of the event
	 * @param data - The data of the event
	 */
	constructor(
		metadata: IEventMetadata,
		data: IFieldChangedEventData<Date | null>,
	) {
		super(metadata, data);
	}
}
