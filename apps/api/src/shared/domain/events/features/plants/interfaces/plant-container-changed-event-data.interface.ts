import { IPlantEventData } from '@/shared/domain/events/features/plants/interfaces/plant-event-data.interface';

export interface IPlantContainerChangedEventData extends IPlantEventData {
  oldContainerId: string;
  newContainerId: string;
}
