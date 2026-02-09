import { Building2Icon, HomeIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import type { FilterOption } from 'shared/components/ui/search-and-filters/search-and-filters';
import type { LocationResponse } from '../../api/types';
import type { LocationCreateFormValues } from '../../schemas/location-create/location-create.schema';
import type { LocationUpdateFormValues } from '../../schemas/location-update/location-update.schema';
import { useLocationsPageStore } from '../../stores/locations-page-store';
import { useLocationCreate } from '../use-location-create/use-location-create';
import { useLocationDelete } from '../use-location-delete/use-location-delete';
import { useLocationUpdate } from '../use-location-update/use-location-update';
import { useLocationsFindByCriteria } from '../use-locations-find-by-criteria/use-locations-find-by-criteria';

const LOCATIONS_PER_PAGE = 12;
const LOCATIONS_PER_PAGE_VIRTUAL = 1000; // Fetch many items for virtualization
const SEARCH_DEBOUNCE_DELAY = 250; // milliseconds

/**
 * Hook that provides all the logic for the locations page
 * Centralizes state management, data fetching, and event handlers
 * Uses TanStack Query instead of SDK
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

	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
	const [useVirtualization, setUseVirtualization] = useState(true); // Enable by default for large datasets

	// Debounce search query
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchQuery(searchQuery);
		}, SEARCH_DEBOUNCE_DELAY);

		return () => clearTimeout(timer);
	}, [searchQuery]);

	// Build input for API
	const criteriaInput = useMemo(
		() => ({
			page: useVirtualization ? 1 : currentPage,
			perPage: useVirtualization ? LOCATIONS_PER_PAGE_VIRTUAL : LOCATIONS_PER_PAGE,
			search: debouncedSearchQuery || undefined,
			sortBy: 'createdAt',
			sortOrder: 'desc' as const,
		}),
		[debouncedSearchQuery, currentPage, useVirtualization],
	);

	const {
		locations,
		isLoading: isLoadingLocations,
		error: locationsError,
		refetch,
	} = useLocationsFindByCriteria(criteriaInput);

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
			{ value: 'all', label: t('features.locations.list.filters.all') },
			{
				value: 'indoor',
				label: t('features.locations.list.filters.indoor'),
				icon: HomeIcon,
			},
			{
				value: 'outdoor',
				label: t('features.locations.list.filters.outdoor'),
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
		if (!selectedLocation) return;
		await handleUpdate(selectedLocation.id, values, () => {
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

	// Reset to page 1 when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [debouncedSearchQuery, setCurrentPage]);

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
		useVirtualization,
		setUseVirtualization,
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
