import { DynamicFilter, FilterField } from '../components/organisms/dynamic-filters';

interface UseDynamicFiltersProps {
	fields: FilterField[];
	operators: { label: string; value: string }[];
	filters: DynamicFilter[];
	onFiltersChange: (filters: DynamicFilter[]) => void;
}

interface UseDynamicFiltersReturn {
	filters: DynamicFilter[];
	addFilter: () => void;
	removeFilter: (id: string) => void;
	updateFilter: (id: string, updates: Partial<DynamicFilter>) => void;
	getFieldType: (fieldKey: string) => FilterField['type'];
	getFieldEnumOptions: (fieldKey: string) => { label: string; value: string }[];
}

export function useDynamicFilters({
	fields,
	operators,
	filters,
	onFiltersChange,
}: UseDynamicFiltersProps): UseDynamicFiltersReturn {
	const addFilter = () => {
		const newFilter: DynamicFilter = {
			id: `filter-${Date.now()}`,
			field: fields[0]?.key || '',
			operator: operators[0]?.value || '',
			value: '',
		};
		onFiltersChange([...filters, newFilter]);
	};

	const removeFilter = (id: string) => {
		onFiltersChange(filters.filter((f) => f.id !== id));
	};

	const updateFilter = (id: string, updates: Partial<DynamicFilter>) => {
		onFiltersChange(
			filters.map((f) => (f.id === id ? { ...f, ...updates } : f)),
		);
	};

	const getFieldType = (fieldKey: string): FilterField['type'] => {
		return fields.find((f) => f.key === fieldKey)?.type || 'text';
	};

	const getFieldEnumOptions = (fieldKey: string) => {
		return fields.find((f) => f.key === fieldKey)?.enumOptions || [];
	};

	return {
		filters,
		addFilter,
		removeFilter,
		updateFilter,
		getFieldType,
		getFieldEnumOptions,
	};
}
