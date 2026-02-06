import type { DynamicFilter } from '@/shared/components/organisms/table-layout';
import { FilterOperator } from '@/shared/enums/filter-operator.enum';
import type { IFilter } from '@/shared/interfaces/filter.interface';

/**
 * Options for converting dynamic filters to API format
 */
export interface ConvertFiltersMapperOptions {
	/**
	 * Optional search term to add as a LIKE filter
	 */
	search?: string;
	/**
	 * Field to use for search filter (required if search is provided)
	 */
	searchField?: string;
	/**
	 * Operator to use for search filter (defaults to LIKE)
	 */
	searchOperator?: FilterOperator;
}

/**
 * Converts dynamic filters to API format
 * @param filters - Array of dynamic filters from the UI
 * @param options - Optional search configuration
 * @returns Array of filters in API format
 */
export function dynamicFiltersToApiFiltersMapper(
	filters: DynamicFilter[],
	options?: ConvertFiltersMapperOptions,
): IFilter[] {
	const apiFilters: IFilter[] = [];

	// Add search filter if provided
	if (options?.search && options?.searchField) {
		apiFilters.push({
			field: options.searchField,
			operator: options.searchOperator || FilterOperator.LIKE,
			value: options.search,
		});
	}

	// Convert dynamic filters to API format
	const convertedFilters = filters
		.filter((f) => f.field && f.operator && f.value)
		.map((f) => ({
			field: f.field,
			operator: f.operator as FilterOperator,
			value: f.value,
		}));

	apiFilters.push(...convertedFilters);

	return apiFilters;
}
