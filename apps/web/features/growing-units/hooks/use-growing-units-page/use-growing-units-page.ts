import type {
	FilterOperator,
	GrowingUnitType,
	LengthUnit,
} from 'features/growing-units/api/types';
import { useGrowingUnitCreate } from 'features/growing-units/hooks/use-growing-unit-create/use-growing-unit-create';
import { useGrowingUnitUpdate } from 'features/growing-units/hooks/use-growing-unit-update/use-growing-unit-update';
import { useGrowingUnitsFindByCriteria } from 'features/growing-units/hooks/use-growing-units-find-by-criteria/use-growing-units-find-by-criteria';
import type { GrowingUnitCreateFormValues } from 'features/growing-units/schemas/growing-unit-create/growing-unit-create.schema';
import type { GrowingUnitUpdateFormValues } from 'features/growing-units/schemas/growing-unit-update/growing-unit-update.schema';
import { useGrowingUnitsPageStore } from 'features/growing-units/stores/growing-units-page-store';
import { Building2Icon, FlowerIcon, HomeIcon, PackageIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import type { FilterOption } from 'shared/components/ui/search-and-filters/search-and-filters';

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
			{ value: 'all', label: t('features.growingUnits.list.filters.all') },
			{
				value: 'indoor',
				label: t('features.growingUnits.list.filters.indoor'),
				icon: HomeIcon,
			},
			{
				value: 'outdoor',
				label: t('features.growingUnits.list.filters.outdoor'),
				icon: Building2Icon,
			},
			{
				value: 'pots',
				label: t('features.growingUnits.list.filters.pots'),
				icon: FlowerIcon,
			},
			{
				value: 'beds',
				label: t('features.growingUnits.list.filters.beds'),
				icon: PackageIcon,
			},
		],
		[t],
	);

	const handleCreateSubmit = async (values: GrowingUnitCreateFormValues) => {
		await handleCreate(
			{
				locationId: values.locationId,
				name: values.name,
				type: values.type as GrowingUnitType,
				capacity: values.capacity,
				length: values.length,
				width: values.width,
				height: values.height,
				unit: values.unit as LengthUnit,
			},
			() => {
				refetch();
				setCreateDialogOpen(false);
			},
		);
	};

	const handleUpdateSubmit = async (values: GrowingUnitUpdateFormValues) => {
		await handleUpdate(
			{
				id: values.id,
				locationId: values.locationId,
				name: values.name,
				type: values.type as GrowingUnitType | undefined,
				capacity: values.capacity,
				length: values.length,
				width: values.width,
				height: values.height,
				unit: values.unit as LengthUnit | undefined,
			},
			() => {
				refetch();
				setUpdateDialogOpen(false);
				setSelectedGrowingUnit(null);
			},
		);
	};

	const handleAddClick = () => {
		setCreateDialogOpen(true);
	};

	// Reset to page 1 when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [debouncedSearchQuery, selectedFilter, setCurrentPage]);

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
