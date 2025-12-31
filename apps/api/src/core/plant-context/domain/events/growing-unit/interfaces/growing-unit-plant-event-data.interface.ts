import { IPlantEventData } from "@/core/plant-context/domain/events/plant/interfaces/plant-event-data.interface";

export interface IGrowingUnitPlantEventData {
	growingUnitId: string;
	plant: IPlantEventData;
}
