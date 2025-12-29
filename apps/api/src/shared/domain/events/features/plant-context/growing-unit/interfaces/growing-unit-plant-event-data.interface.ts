import { IPlantEventData } from '@/shared/domain/events/features/plant-context/growing-unit/interfaces/plants/plant-event-data.interface';

export interface IGrowingUnitPlantEventData {
  growingUnitId: string;
  plant: IPlantEventData;
}
