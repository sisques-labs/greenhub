'use client';

import {
	FilterButtons,
	type FilterOption,
} from '@/shared/components/ui/filter-buttons/filter-buttons';
import { SearchBar } from '@/shared/components/ui/search-bar/search-bar';

export type { FilterOption };

interface SearchAndFiltersProps {
	searchPlaceholder: string;
	searchValue: string;
	onSearchChange: (value: string) => void;
	filterOptions: FilterOption[];
	selectedFilter: string;
	onFilterChange: (value: string) => void;
	searchBarClassName?: string;
	filtersClassName?: string;
	className?: string;
}

/**
 * Reusable component that combines search bar and filter buttons
 */
export function SearchAndFilters({
	searchPlaceholder,
	searchValue,
	onSearchChange,
	filterOptions,
	selectedFilter,
	onFilterChange,
	searchBarClassName,
	filtersClassName,
	className,
}: SearchAndFiltersProps) {
	return (
		<div className={`flex gap-4 items-center flex-wrap ${className || ''}`}>
			<SearchBar
				placeholder={searchPlaceholder}
				value={searchValue}
				onChange={onSearchChange}
				className={`flex-1 min-w-[300px] ${searchBarClassName || ''}`}
			/>
			<FilterButtons
				options={filterOptions}
				selectedValue={selectedFilter}
				onValueChange={onFilterChange}
				className={filtersClassName}
			/>
		</div>
	);
}
