import { FilterOperator } from '@/shared/enums/filter-operator.enum';

export interface IFilter {
	field: string;
	operator: FilterOperator;
	value: unknown;
}
