import { IPlantSpeciesEventData } from '@/core/plant-species-context/domain/events/plant-species/interfaces/plant-species-event-data.interface';
import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';

export class PlantSpeciesCreatedEvent extends BaseEvent<IPlantSpeciesEventData> {
	constructor(metadata: IEventMetadata, data: IPlantSpeciesEventData) {
		super(metadata, data);
	}
}
