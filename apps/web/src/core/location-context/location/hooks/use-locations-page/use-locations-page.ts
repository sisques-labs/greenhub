import type { LocationCreateFormValues } from '@/core/location-context/location/dtos/schemas/location-create/location-create.schema';
import type { LocationUpdateFormValues } from '@/core/location-context/location/dtos/schemas/location-update/location-update.schema';
import { useLocationCreate } from '@/core/location-context/location/hooks/use-location-create/use-location-create';
import { useLocationDelete } from '@/core/location-context/location/hooks/use-location-delete/use-location-delete';
import { useLocationUpdate } from '@/core/location-context/location/hooks/use-location-update/use-location-update';
import { useLocationsFindByCriteria } from '@/core/location-context/location/hooks/use-locations-find-by-criteria/use-locations-find-by-criteria';
import { useLocationsPageStore } from '@/core/location-context/location/stores/locations-page-store';
import type { FilterOption } from '@/shared/components/ui/search-and-filters/search-and-filters';
import type { LocationResponse } from '@repo/sdk';
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
		updateDialogOpen,
		setUpdateDialogOpen,
		deleteDialogOpen,
		setDeleteDialogOpen,
		selectedLocation,
		setSelectedLocation,
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

	const {
		handleUpdate,
		isLoading: isUpdating,
		error: updateError,
	} = useLocationUpdate();

	const {
		handleDelete,
		isLoading: isDeleting,
		error: deleteError,
	} = useLocationDelete();

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

	const handleUpdateSubmit = async (values: LocationUpdateFormValues) => {
		await handleUpdate(values, () => {
			refetch();
			setUpdateDialogOpen(false);
			setSelectedLocation(null);
		});
	};

	const handleDeleteSubmit = async () => {
		if (!selectedLocation) return;
		await handleDelete(selectedLocation.id, () => {
			refetch();
			setDeleteDialogOpen(false);
			setSelectedLocation(null);
		});
	};

	const handleAddClick = () => {
		setCreateDialogOpen(true);
	};

	const handleEditClick = (location: LocationResponse) => {
		setSelectedLocation(location);
		setUpdateDialogOpen(true);
	};

	const handleDeleteClick = (id: string) => {
		const location = locations?.items.find((loc) => loc.id === id);
		if (location) {
			setSelectedLocation(location);
			setDeleteDialogOpen(true);
		}
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		// Scroll to top when page changes
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const isLoading = useMemo(
		() => isLoadingLocations || locations === null || locations === undefined,
		[isLoadingLocations, locations],
	);

	return {
		// State
		createDialogOpen,
		setCreateDialogOpen,
		updateDialogOpen,
		setUpdateDialogOpen,
		deleteDialogOpen,
		setDeleteDialogOpen,
		selectedLocation,
		setSelectedLocation,
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
		handleUpdateSubmit,
		handleDeleteSubmit,
		handleAddClick,
		handleEditClick,
		handleDeleteClick,
		handlePageChange,

		// Loading states
		isCreating,
		isUpdating,
		isDeleting,

		// Errors
		createError,
		updateError,
		deleteError,
	};
}
