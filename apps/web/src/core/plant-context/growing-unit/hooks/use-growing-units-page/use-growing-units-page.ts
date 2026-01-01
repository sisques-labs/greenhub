import type { GrowingUnitCreateFormValues } from '@/core/plant-context/growing-unit/dtos/schemas/growing-unit-create/growing-unit-create.schema';
import type { GrowingUnitUpdateFormValues } from '@/core/plant-context/growing-unit/dtos/schemas/growing-unit-update/growing-unit-update.schema';
import { useGrowingUnitCreate } from '@/core/plant-context/growing-unit/hooks/use-growing-unit-create/use-growing-unit-create';
import { useGrowingUnitUpdate } from '@/core/plant-context/growing-unit/hooks/use-growing-unit-update/use-growing-unit-update';
import { useGrowingUnitsFindByCriteria } from '@/core/plant-context/growing-unit/hooks/use-growing-units-find-by-criteria/use-growing-units-find-by-criteria';
import { useGrowingUnitsPageStore } from '@/core/plant-context/growing-unit/stores/growing-units-page-store';
import type { FilterOption } from '@/shared/components/ui/search-and-filters/search-and-filters';
import { Building2Icon, FlowerIcon, HomeIcon, PackageIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

const GROWING_UNITS_PER_PAGE = 12;

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

	const paginationInput = useMemo(
		() => ({
			pagination: {
				page: currentPage,
				perPage: GROWING_UNITS_PER_PAGE,
			},
		}),
		[currentPage],
	);

	const {
		growingUnits,
		isLoading: isLoadingGrowingUnits,
		error: growingUnitsError,
		refetch,
	} = useGrowingUnitsFindByCriteria(paginationInput);

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
