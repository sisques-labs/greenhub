import { IBaseViewModelDto } from '@/shared/domain/interfaces/base-view-model-dto.interface';

export interface IContainerPlantViewModelDto extends IBaseViewModelDto {
  name: string;
  species: string;
  plantedDate: Date | null;
  notes: string | null;
  status: string;
}
