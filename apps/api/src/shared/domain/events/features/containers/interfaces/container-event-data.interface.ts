import { IBaseEventData } from '@/shared/domain/interfaces/base-event-data.interface';

export interface IContainerEventData extends IBaseEventData {
  id: string;
  name: string;
  type: string;
}
