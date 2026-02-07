import { renderHook, act } from '@testing-library/react';
import { useDynamicFilters } from './use-dynamic-filters';
import { DynamicFilter, FilterField } from '../components/organisms/dynamic-filters';

describe('useDynamicFilters', () => {
	const mockOnFiltersChange = jest.fn();

	const mockFields: FilterField[] = [
		{ key: 'name', label: 'Name', type: 'text' },
		{ key: 'age', label: 'Age', type: 'number' },
		{ key: 'birthDate', label: 'Birth Date', type: 'date' },
		{
			key: 'status',
			label: 'Status',
			type: 'enum',
			enumOptions: [
				{ label: 'Active', value: 'active' },
				{ label: 'Inactive', value: 'inactive' },
			],
		},
	];

	const mockOperators = [
		{ label: 'Equals', value: 'eq' },
		{ label: 'Contains', value: 'contains' },
		{ label: 'Greater than', value: 'gt' },
	];

	const defaultProps = {
		fields: mockFields,
		operators: mockOperators,
		filters: [] as DynamicFilter[],
		onFiltersChange: mockOnFiltersChange,
	};

	beforeEach(() => {
		jest.clearAllMocks();
		jest.spyOn(Date, 'now').mockReturnValue(1234567890);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('Initialization', () => {
		it('should initialize with provided filters', () => {
			const initialFilters: DynamicFilter[] = [
				{ id: 'filter-1', field: 'name', operator: 'eq', value: 'test' },
			];
			const { result } = renderHook(() =>
				useDynamicFilters({ ...defaultProps, filters: initialFilters }),
			);

			expect(result.current.filters).toEqual(initialFilters);
		});

		it('should initialize with empty filters array', () => {
			const { result } = renderHook(() => useDynamicFilters(defaultProps));

			expect(result.current.filters).toEqual([]);
		});
	});

	describe('addFilter', () => {
		it('should add a new filter with default values', () => {
			const { result } = renderHook(() => useDynamicFilters(defaultProps));

			act(() => {
				result.current.addFilter();
			});

			expect(mockOnFiltersChange).toHaveBeenCalledWith([
				{
					id: 'filter-1234567890',
					field: 'name',
					operator: 'eq',
					value: '',
				},
			]);
		});

		it('should add filter with first field and operator from props', () => {
			const customFields: FilterField[] = [
				{ key: 'email', label: 'Email', type: 'text' },
			];
			const customOperators = [{ label: 'Not equals', value: 'neq' }];

			const { result } = renderHook(() =>
				useDynamicFilters({
					...defaultProps,
					fields: customFields,
					operators: customOperators,
				}),
			);

			act(() => {
				result.current.addFilter();
			});

			expect(mockOnFiltersChange).toHaveBeenCalledWith([
				{
					id: 'filter-1234567890',
					field: 'email',
					operator: 'neq',
					value: '',
				},
			]);
		});

		it('should add filter to existing filters array', () => {
			const existingFilters: DynamicFilter[] = [
				{ id: 'filter-1', field: 'name', operator: 'eq', value: 'John' },
			];

			const { result } = renderHook(() =>
				useDynamicFilters({ ...defaultProps, filters: existingFilters }),
			);

			act(() => {
				result.current.addFilter();
			});

			expect(mockOnFiltersChange).toHaveBeenCalledWith([
				{ id: 'filter-1', field: 'name', operator: 'eq', value: 'John' },
				{
					id: 'filter-1234567890',
					field: 'name',
					operator: 'eq',
					value: '',
				},
			]);
		});

		it('should handle empty fields array gracefully', () => {
			const { result } = renderHook(() =>
				useDynamicFilters({
					...defaultProps,
					fields: [],
				}),
			);

			act(() => {
				result.current.addFilter();
			});

			expect(mockOnFiltersChange).toHaveBeenCalledWith([
				{
					id: 'filter-1234567890',
					field: '',
					operator: 'eq',
					value: '',
				},
			]);
		});

		it('should handle empty operators array gracefully', () => {
			const { result } = renderHook(() =>
				useDynamicFilters({
					...defaultProps,
					operators: [],
				}),
			);

			act(() => {
				result.current.addFilter();
			});

			expect(mockOnFiltersChange).toHaveBeenCalledWith([
				{
					id: 'filter-1234567890',
					field: 'name',
					operator: '',
					value: '',
				},
			]);
		});
	});

	describe('removeFilter', () => {
		it('should remove filter by id', () => {
			const existingFilters: DynamicFilter[] = [
				{ id: 'filter-1', field: 'name', operator: 'eq', value: 'John' },
				{ id: 'filter-2', field: 'age', operator: 'gt', value: '25' },
			];

			const { result } = renderHook(() =>
				useDynamicFilters({ ...defaultProps, filters: existingFilters }),
			);

			act(() => {
				result.current.removeFilter('filter-1');
			});

			expect(mockOnFiltersChange).toHaveBeenCalledWith([
				{ id: 'filter-2', field: 'age', operator: 'gt', value: '25' },
			]);
		});

		it('should handle removing non-existent filter gracefully', () => {
			const existingFilters: DynamicFilter[] = [
				{ id: 'filter-1', field: 'name', operator: 'eq', value: 'John' },
			];

			const { result } = renderHook(() =>
				useDynamicFilters({ ...defaultProps, filters: existingFilters }),
			);

			act(() => {
				result.current.removeFilter('non-existent');
			});

			expect(mockOnFiltersChange).toHaveBeenCalledWith([
				{ id: 'filter-1', field: 'name', operator: 'eq', value: 'John' },
			]);
		});

		it('should remove all filters when removing from single filter array', () => {
			const existingFilters: DynamicFilter[] = [
				{ id: 'filter-1', field: 'name', operator: 'eq', value: 'John' },
			];

			const { result } = renderHook(() =>
				useDynamicFilters({ ...defaultProps, filters: existingFilters }),
			);

			act(() => {
				result.current.removeFilter('filter-1');
			});

			expect(mockOnFiltersChange).toHaveBeenCalledWith([]);
		});
	});

	describe('updateFilter', () => {
		it('should update filter field', () => {
			const existingFilters: DynamicFilter[] = [
				{ id: 'filter-1', field: 'name', operator: 'eq', value: 'John' },
			];

			const { result } = renderHook(() =>
				useDynamicFilters({ ...defaultProps, filters: existingFilters }),
			);

			act(() => {
				result.current.updateFilter('filter-1', { field: 'age' });
			});

			expect(mockOnFiltersChange).toHaveBeenCalledWith([
				{ id: 'filter-1', field: 'age', operator: 'eq', value: 'John' },
			]);
		});

		it('should update filter operator', () => {
			const existingFilters: DynamicFilter[] = [
				{ id: 'filter-1', field: 'name', operator: 'eq', value: 'John' },
			];

			const { result } = renderHook(() =>
				useDynamicFilters({ ...defaultProps, filters: existingFilters }),
			);

			act(() => {
				result.current.updateFilter('filter-1', { operator: 'contains' });
			});

			expect(mockOnFiltersChange).toHaveBeenCalledWith([
				{ id: 'filter-1', field: 'name', operator: 'contains', value: 'John' },
			]);
		});

		it('should update filter value', () => {
			const existingFilters: DynamicFilter[] = [
				{ id: 'filter-1', field: 'name', operator: 'eq', value: 'John' },
			];

			const { result } = renderHook(() =>
				useDynamicFilters({ ...defaultProps, filters: existingFilters }),
			);

			act(() => {
				result.current.updateFilter('filter-1', { value: 'Jane' });
			});

			expect(mockOnFiltersChange).toHaveBeenCalledWith([
				{ id: 'filter-1', field: 'name', operator: 'eq', value: 'Jane' },
			]);
		});

		it('should update multiple filter properties at once', () => {
			const existingFilters: DynamicFilter[] = [
				{ id: 'filter-1', field: 'name', operator: 'eq', value: 'John' },
			];

			const { result } = renderHook(() =>
				useDynamicFilters({ ...defaultProps, filters: existingFilters }),
			);

			act(() => {
				result.current.updateFilter('filter-1', {
					field: 'age',
					operator: 'gt',
					value: '25',
				});
			});

			expect(mockOnFiltersChange).toHaveBeenCalledWith([
				{ id: 'filter-1', field: 'age', operator: 'gt', value: '25' },
			]);
		});

		it('should only update the specified filter', () => {
			const existingFilters: DynamicFilter[] = [
				{ id: 'filter-1', field: 'name', operator: 'eq', value: 'John' },
				{ id: 'filter-2', field: 'age', operator: 'gt', value: '25' },
			];

			const { result } = renderHook(() =>
				useDynamicFilters({ ...defaultProps, filters: existingFilters }),
			);

			act(() => {
				result.current.updateFilter('filter-1', { value: 'Jane' });
			});

			expect(mockOnFiltersChange).toHaveBeenCalledWith([
				{ id: 'filter-1', field: 'name', operator: 'eq', value: 'Jane' },
				{ id: 'filter-2', field: 'age', operator: 'gt', value: '25' },
			]);
		});

		it('should handle updating non-existent filter gracefully', () => {
			const existingFilters: DynamicFilter[] = [
				{ id: 'filter-1', field: 'name', operator: 'eq', value: 'John' },
			];

			const { result } = renderHook(() =>
				useDynamicFilters({ ...defaultProps, filters: existingFilters }),
			);

			act(() => {
				result.current.updateFilter('non-existent', { value: 'Jane' });
			});

			expect(mockOnFiltersChange).toHaveBeenCalledWith([
				{ id: 'filter-1', field: 'name', operator: 'eq', value: 'John' },
			]);
		});
	});

	describe('getFieldType', () => {
		it('should return correct type for text field', () => {
			const { result } = renderHook(() => useDynamicFilters(defaultProps));

			const fieldType = result.current.getFieldType('name');

			expect(fieldType).toBe('text');
		});

		it('should return correct type for number field', () => {
			const { result } = renderHook(() => useDynamicFilters(defaultProps));

			const fieldType = result.current.getFieldType('age');

			expect(fieldType).toBe('number');
		});

		it('should return correct type for date field', () => {
			const { result } = renderHook(() => useDynamicFilters(defaultProps));

			const fieldType = result.current.getFieldType('birthDate');

			expect(fieldType).toBe('date');
		});

		it('should return correct type for enum field', () => {
			const { result } = renderHook(() => useDynamicFilters(defaultProps));

			const fieldType = result.current.getFieldType('status');

			expect(fieldType).toBe('enum');
		});

		it('should return "text" as default for unknown field', () => {
			const { result } = renderHook(() => useDynamicFilters(defaultProps));

			const fieldType = result.current.getFieldType('unknown');

			expect(fieldType).toBe('text');
		});
	});

	describe('getFieldEnumOptions', () => {
		it('should return enum options for enum field', () => {
			const { result } = renderHook(() => useDynamicFilters(defaultProps));

			const enumOptions = result.current.getFieldEnumOptions('status');

			expect(enumOptions).toEqual([
				{ label: 'Active', value: 'active' },
				{ label: 'Inactive', value: 'inactive' },
			]);
		});

		it('should return empty array for non-enum field', () => {
			const { result } = renderHook(() => useDynamicFilters(defaultProps));

			const enumOptions = result.current.getFieldEnumOptions('name');

			expect(enumOptions).toEqual([]);
		});

		it('should return empty array for unknown field', () => {
			const { result } = renderHook(() => useDynamicFilters(defaultProps));

			const enumOptions = result.current.getFieldEnumOptions('unknown');

			expect(enumOptions).toEqual([]);
		});

		it('should return empty array for enum field without enumOptions', () => {
			const customFields: FilterField[] = [
				{ key: 'category', label: 'Category', type: 'enum' },
			];

			const { result } = renderHook(() =>
				useDynamicFilters({ ...defaultProps, fields: customFields }),
			);

			const enumOptions = result.current.getFieldEnumOptions('category');

			expect(enumOptions).toEqual([]);
		});
	});

	describe('Integration Tests', () => {
		it('should handle complete filter lifecycle', () => {
			const { result } = renderHook(() => useDynamicFilters(defaultProps));

			// Add filter
			act(() => {
				result.current.addFilter();
			});

			const addedFilter = mockOnFiltersChange.mock.calls[0][0][0];

			// Update filter
			act(() => {
				result.current.updateFilter(addedFilter.id, {
					field: 'status',
					value: 'active',
				});
			});

			expect(mockOnFiltersChange).toHaveBeenLastCalledWith([
				{
					id: addedFilter.id,
					field: 'status',
					operator: 'eq',
					value: 'active',
				},
			]);

			// Remove filter
			act(() => {
				result.current.removeFilter(addedFilter.id);
			});

			expect(mockOnFiltersChange).toHaveBeenLastCalledWith([]);
		});

		it('should handle multiple filters correctly', () => {
			const { result } = renderHook(() => useDynamicFilters(defaultProps));

			// Add first filter
			act(() => {
				result.current.addFilter();
			});

			const firstFilter = mockOnFiltersChange.mock.calls[0][0][0];

			// Mock new timestamp for second filter
			jest.spyOn(Date, 'now').mockReturnValue(1234567891);

			// Add second filter
			act(() => {
				result.current.addFilter();
			});

			expect(mockOnFiltersChange).toHaveBeenLastCalledWith([
				firstFilter,
				{
					id: 'filter-1234567891',
					field: 'name',
					operator: 'eq',
					value: '',
				},
			]);
		});
	});
});
