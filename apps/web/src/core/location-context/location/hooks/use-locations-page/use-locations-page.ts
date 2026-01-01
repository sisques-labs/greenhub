import type { LocationCreateFormValues } from '@/core/location-context/location/dtos/schemas/location-create/location-create.schema';
import { useLocationCreate } from '@/core/location-context/location/hooks/use-location-create/use-location-create';
import { useLocationsFindByCriteria } from '@/core/location-context/location/hooks/use-locations-find-by-criteria/use-locations-find-by-criteria';
import { useLocationsPageStore } from '@/core/location-context/location/stores/locations-page-store';
import type { FilterOption } from '@/shared/components/ui/search-and-filters/search-and-filters';
import { Building2Icon, HomeIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

const LOCATIONS_PER_PAGE = 12;

/**
 * Hook that provides all the logic for the locations page
 * Centralizes state management, data fetching, and event handlers
 */
export function useLocationsPage() {
	const t = useTranslations();
	const {
		createDialogOpen,
		setCreateDialogOpen,
		searchQuery,
		setSearchQuery,
		selectedFilter,
		setSelectedFilter,
		currentPage,
		setCurrentPage,
	} = useLocationsPageStore();

	const paginationInput = useMemo(
		() => ({
			pagination: {
				page: currentPage,
				perPage: LOCATIONS_PER_PAGE,
			},
		}),
		[currentPage],
	);

	const {
		locations,
		isLoading: isLoadingLocations,
		error: locationsError,
		refetch,
	} = useLocationsFindByCriteria(paginationInput);

	const {
		handleCreate,
		isLoading: isCreating,
		error: createError,
	} = useLocationCreate();

	const filterOptions: FilterOption[] = useMemo(
		() => [
			{ value: 'all', label: t('pages.locations.list.filters.all') },
			{
				value: 'indoor',
				label: t('pages.locations.list.filters.indoor'),
				icon: HomeIcon,
			},
			{
				value: 'outdoor',
				label: t('pages.locations.list.filters.outdoor'),
				icon: Building2Icon,
			},
		],
		[t],
	);

	const handleCreateSubmit = async (values: LocationCreateFormValues) => {
		await handleCreate(values, () => {
			// Reset to first page to see the new location
			setCurrentPage(1);
			// Refetch locations to get the updated list
			refetch();
			setCreateDialogOpen(false);
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
			isLoadingLocations ||
			locations === null ||
			locations === undefined,
		[isLoadingLocations, locations],
	);

	return {
		// State
		createDialogOpen,
		setCreateDialogOpen,
		searchQuery,
		setSearchQuery,
		selectedFilter,
		setSelectedFilter,
		filterOptions,

		// Data
		locations,
		isLoading,
		locationsError,

		// Actions
		handleCreateSubmit,
		handleAddClick,
		handlePageChange,

		// Loading states
		isCreating,

		// Errors
		createError,
	};
}

