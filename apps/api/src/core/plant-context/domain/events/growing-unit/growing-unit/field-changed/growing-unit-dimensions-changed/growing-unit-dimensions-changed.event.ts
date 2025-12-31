import { BaseEvent } from "@/shared/domain/events/base-event.interface";
import { IEventMetadata } from "@/shared/domain/interfaces/event-metadata.interface";
import { IFieldChangedEventData } from "@/shared/domain/interfaces/updated-field.interface";

export class GrowingUnitDimensionsChangedEvent extends BaseEvent<
	IFieldChangedEventData<{
		length: number;
		width: number;
		height: number;
		unit: string;
	}>
> {
	/**
	 * Constructor
	 *
	 * @param metadata - The metadata of the event
	 * @param data - The data of the event
	 */
	constructor(
		metadata: IEventMetadata,
		data: IFieldChangedEventData<{
			length: number;
			width: number;
			height: number;
			unit: string;
		}>,
	) {
		super(metadata, data);
	}
}
