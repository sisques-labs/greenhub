import { IFilter } from '@/shared/interfaces/filter.interface';
import { IPagination } from '@/shared/interfaces/pagination.interface';
import { ISort } from '@/shared/interfaces/sort.interface';

export class Criteria {
	constructor(
		public filters: IFilter[] = [],
		public sorts: ISort[] = [],
		public pagination: IPagination = { page: 1, perPage: 10 },
	) {}
}
