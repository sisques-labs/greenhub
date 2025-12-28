import { IBaseEventData } from '@/shared/domain/interfaces/base-event-data.interface';

export interface IPlantEventData extends IBaseEventData {
  id: string;
  containerId: string;
  name: string;
  species: string;
  plantedDate: Date | null;
  notes: string | null;
  status: string;
}
