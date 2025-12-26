import { IPlantEventData } from '@/shared/domain/events/features/plants/interfaces/plant-event-data.interface';

/**
 * Event data interface for PlantContainerChangedEvent.
 *
 * @remarks
 * This interface extends IPlantEventData to include information about the container change,
 * specifically the old and new container IDs.
 */
export interface IPlantContainerChangedEventData extends IPlantEventData {
  oldContainerId: string;
  newContainerId: string;
}
