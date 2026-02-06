import { SortDirection } from '@/shared/enums/sort-direction.enum';

export interface ISort {
	field: string;
	direction: SortDirection;
}
