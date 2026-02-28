import { dynamicFiltersToApiFiltersMapper } from '@/shared/mappers/convert-filters.mapper';
import { FilterOperator } from '@/shared/enums/filter-operator.enum';

describe('dynamicFiltersToApiFiltersMapper', () => {
	describe('Basic mapping', () => {
		it('should return empty array for empty filters', () => {
			const result = dynamicFiltersToApiFiltersMapper([]);

			expect(result).toEqual([]);
		});

		it('should map valid filters to API format', () => {
			const filters = [
				{ field: 'name', operator: FilterOperator.EQUALS, value: 'test' },
			];

			const result = dynamicFiltersToApiFiltersMapper(filters);

			expect(result).toEqual([
				{ field: 'name', operator: FilterOperator.EQUALS, value: 'test' },
			]);
		});

		it('should map multiple filters', () => {
			const filters = [
				{ field: 'name', operator: FilterOperator.LIKE, value: 'plant' },
				{ field: 'status', operator: FilterOperator.EQUALS, value: 'GROWING' },
			];

			const result = dynamicFiltersToApiFiltersMapper(filters);

			expect(result).toHaveLength(2);
		});
	});

	describe('Search options', () => {
		it('should add search filter when search and searchField are provided', () => {
			const result = dynamicFiltersToApiFiltersMapper([], {
				search: 'tomato',
				searchField: 'name',
			});

			expect(result).toEqual([
				{
					field: 'name',
					operator: FilterOperator.LIKE,
					value: 'tomato',
				},
			]);
		});

		it('should use default LIKE operator for search', () => {
			const result = dynamicFiltersToApiFiltersMapper([], {
				search: 'tomato',
				searchField: 'name',
			});

			expect(result[0].operator).toBe(FilterOperator.LIKE);
		});

		it('should use custom search operator when provided', () => {
			const result = dynamicFiltersToApiFiltersMapper([], {
				search: 'tomato',
				searchField: 'name',
				searchOperator: FilterOperator.EQUALS,
			});

			expect(result[0].operator).toBe(FilterOperator.EQUALS);
		});

		it('should not add search filter when search is empty', () => {
			const result = dynamicFiltersToApiFiltersMapper([], {
				search: '',
				searchField: 'name',
			});

			expect(result).toHaveLength(0);
		});

		it('should not add search filter when searchField is not provided', () => {
			const result = dynamicFiltersToApiFiltersMapper([], {
				search: 'tomato',
			});

			expect(result).toHaveLength(0);
		});

		it('should combine search and dynamic filters', () => {
			const filters = [
				{ field: 'status', operator: FilterOperator.EQUALS, value: 'GROWING' },
			];

			const result = dynamicFiltersToApiFiltersMapper(filters, {
				search: 'tomato',
				searchField: 'name',
			});

			expect(result).toHaveLength(2);
			expect(result[0].field).toBe('name'); // search filter comes first
			expect(result[1].field).toBe('status');
		});
	});

	describe('Filter validation', () => {
		it('should filter out entries with missing field', () => {
			const filters = [
				{ field: '', operator: FilterOperator.EQUALS, value: 'test' },
				{ field: 'name', operator: FilterOperator.EQUALS, value: 'test' },
			];

			const result = dynamicFiltersToApiFiltersMapper(filters);

			expect(result).toHaveLength(1);
			expect(result[0].field).toBe('name');
		});

		it('should filter out entries with missing operator', () => {
			const filters = [
				{ field: 'name', operator: '' as FilterOperator, value: 'test' },
				{ field: 'status', operator: FilterOperator.EQUALS, value: 'GROWING' },
			];

			const result = dynamicFiltersToApiFiltersMapper(filters);

			expect(result).toHaveLength(1);
			expect(result[0].field).toBe('status');
		});

		it('should filter out entries with missing value', () => {
			const filters = [
				{ field: 'name', operator: FilterOperator.EQUALS, value: '' },
				{ field: 'status', operator: FilterOperator.EQUALS, value: 'GROWING' },
			];

			const result = dynamicFiltersToApiFiltersMapper(filters);

			expect(result).toHaveLength(1);
			expect(result[0].field).toBe('status');
		});
	});

	describe('All filter operators', () => {
		it('should support EQUALS operator', () => {
			const result = dynamicFiltersToApiFiltersMapper([
				{ field: 'status', operator: FilterOperator.EQUALS, value: 'GROWING' },
			]);

			expect(result[0].operator).toBe(FilterOperator.EQUALS);
		});

		it('should support LIKE operator', () => {
			const result = dynamicFiltersToApiFiltersMapper([
				{ field: 'name', operator: FilterOperator.LIKE, value: 'plant' },
			]);

			expect(result[0].operator).toBe(FilterOperator.LIKE);
		});

		it('should support IN operator', () => {
			const result = dynamicFiltersToApiFiltersMapper([
				{ field: 'status', operator: FilterOperator.IN, value: 'GROWING,PLANTED' },
			]);

			expect(result[0].operator).toBe(FilterOperator.IN);
		});
	});
});
