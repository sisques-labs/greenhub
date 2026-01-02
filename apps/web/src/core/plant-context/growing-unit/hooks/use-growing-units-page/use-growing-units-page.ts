import type { GrowingUnitCreateFormValues } from '@/core/plant-context/growing-unit/dtos/schemas/growing-unit-create/growing-unit-create.schema';
import type { GrowingUnitUpdateFormValues } from '@/core/plant-context/growing-unit/dtos/schemas/growing-unit-update/growing-unit-update.schema';
import { useGrowingUnitCreate } from '@/core/plant-context/growing-unit/hooks/use-growing-unit-create/use-growing-unit-create';
import { useGrowingUnitUpdate } from '@/core/plant-context/growing-unit/hooks/use-growing-unit-update/use-growing-unit-update';
import { useGrowingUnitsFindByCriteria } from '@/core/plant-context/growing-unit/hooks/use-growing-units-find-by-criteria/use-growing-units-find-by-criteria';
import { useGrowingUnitsPageStore } from '@/core/plant-context/growing-unit/stores/growing-units-page-store';
import type { FilterOption } from '@/shared/components/ui/search-and-filters/search-and-filters';
import type { FilterOperator } from '@repo/sdk';
import { Building2Icon, FlowerIcon, HomeIcon, PackageIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

const GROWING_UNITS_PER_PAGE = 12;
const SEARCH_DEBOUNCE_DELAY = 250; // milliseconds

/**
 * Hook that provides all the logic for the growing units page
 * Centralizes state management, data fetching, and event handlers
 */
export function useGrowingUnitsPage() {
	const t = useTranslations();
	const {
		createDialogOpen,
		setCreateDialogOpen,
		updateDialogOpen,
		setUpdateDialogOpen,
		selectedGrowingUnit,
		setSelectedGrowingUnit,
		searchQuery,
		setSearchQuery,
		selectedFilter,
		setSelectedFilter,
		currentPage,
		setCurrentPage,
	} = useGrowingUnitsPageStore();

	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

	// Debounce search query
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchQuery(searchQuery);
		}, SEARCH_DEBOUNCE_DELAY);

		return () => clearTimeout(timer);
	}, [searchQuery]);

	// Build filters for backend
	const filters = useMemo(() => {
		const backendFilters: Array<{
			field: string;
			operator: FilterOperator;
			value: string;
		}> = [];

		// Search filter - search in name field
		if (debouncedSearchQuery) {
			backendFilters.push({
				field: 'name',
				operator: 'LIKE',
				value: debouncedSearchQuery,
			});
		}

		// Type filter
		if (selectedFilter !== 'all') {
			switch (selectedFilter) {
				case 'indoor':
				case 'outdoor':
				case 'pots':
				case 'beds':
					// TODO: Map filter values to actual growing unit types when backend supports it
					// For now, we'll skip type filtering until the backend supports it
					break;
				default:
					break;
			}
		}

		return backendFilters;
	}, [debouncedSearchQuery, selectedFilter]);

	const criteriaInput = useMemo(
		() => ({
			filters: filters.length > 0 ? filters : undefined,
			pagination: {
				page: currentPage,
				perPage: GROWING_UNITS_PER_PAGE,
			},
			sorts: [
				{
					field: 'createdAt',
					direction: 'DESC' as const,
				},
			],
		}),
		[filters, currentPage],
	);

	const {
		growingUnits,
		isLoading: isLoadingGrowingUnits,
		error: growingUnitsError,
		refetch,
	} = useGrowingUnitsFindByCriteria(criteriaInput);

	const {
		handleCreate,
		isLoading: isCreating,
		error: createError,
	} = useGrowingUnitCreate();

	const {
		handleUpdate,
		isLoading: isUpdating,
		error: updateError,
	} = useGrowingUnitUpdate();

	const filterOptions: FilterOption[] = useMemo(
		() => [
			{ value: 'all', label: t('pages.growingUnits.list.filters.all') },
			{
				value: 'indoor',
				label: t('pages.growingUnits.list.filters.indoor'),
				icon: HomeIcon,
			},
			{
				value: 'outdoor',
				label: t('pages.growingUnits.list.filters.outdoor'),
				icon: Building2Icon,
			},
			{
				value: 'pots',
				label: t('pages.growingUnits.list.filters.pots'),
				icon: FlowerIcon,
			},
			{
				value: 'beds',
				label: t('pages.growingUnits.list.filters.beds'),
				icon: PackageIcon,
			},
		],
		[t],
	);

	const handleCreateSubmit = async (values: GrowingUnitCreateFormValues) => {
		await handleCreate(values, () => {
			refetch();
			setCreateDialogOpen(false);
		});
	};

	const handleUpdateSubmit = async (values: GrowingUnitUpdateFormValues) => {
		await handleUpdate(values, () => {
			refetch();
			setUpdateDialogOpen(false);
			setSelectedGrowingUnit(null);
		});
	};

	const handleAddClick = () => {
		setCreateDialogOpen(true);
	};

	// Reset to page 1 when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [debouncedSearchQuery, selectedFilter]);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		// Scroll to top when page changes
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const isLoading = useMemo(
		() =>
			isLoadingGrowingUnits ||
			growingUnits === null ||
			growingUnits === undefined,
		[isLoadingGrowingUnits, growingUnits],
	);

	return {
		// State
		createDialogOpen,
		setCreateDialogOpen,
		updateDialogOpen,
		setUpdateDialogOpen,
		selectedGrowingUnit,
		setSelectedGrowingUnit,
		searchQuery,
		setSearchQuery,
		selectedFilter,
		setSelectedFilter,
		filterOptions,

		// Data
		growingUnits,
		isLoading,
		growingUnitsError,

		// Actions
		handleCreateSubmit,
		handleUpdateSubmit,
		handleAddClick,
		handlePageChange,

		// Loading states
		isCreating,
		isUpdating,

		// Errors
		createError,
		updateError,
	};
}
