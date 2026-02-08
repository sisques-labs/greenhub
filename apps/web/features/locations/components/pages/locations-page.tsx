'use client';

import { PageHeader } from '@/shared/components/organisms/page-header';
import { Button } from '@/shared/components/ui/button';
import { LocationAddCard } from 'features/locations/components/organisms/location-add-card/location-add-card';
import { LocationCard } from 'features/locations/components/organisms/location-card/location-card';
import { LocationCreateForm } from 'features/locations/components/organisms/location-create-form/location-create-form';
import { LocationDeleteDialog } from 'features/locations/components/organisms/location-delete-dialog/location-delete-dialog';
import { LocationUpdateForm } from 'features/locations/components/organisms/location-update-form/location-update-form';
import { LocationsCardsSkeleton } from 'features/locations/components/organisms/locations-cards-skeleton/locations-cards-skeleton';
import { useLocationsPage } from 'features/locations/hooks/use-locations-page/use-locations-page';
import { PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PaginatedResults } from 'shared/components/ui/paginated-results/paginated-results';
import { SearchAndFilters } from 'shared/components/ui/search-and-filters/search-and-filters';

const LOCATIONS_PER_PAGE = 12;

export function LocationsPage() {
	const t = useTranslations();
	const {
		createDialogOpen,
		setCreateDialogOpen,
		updateDialogOpen,
		setUpdateDialogOpen,
		deleteDialogOpen,
		setDeleteDialogOpen,
		selectedLocation,
		searchQuery,
		setSearchQuery,
		selectedFilter,
		setSelectedFilter,
		filterOptions,
		locations,
		isLoading,
		locationsError,
		handleCreateSubmit,
		handleUpdateSubmit,
		handleDeleteSubmit,
		handleAddClick,
		handleEditClick,
		handleDeleteClick,
		handlePageChange,
		isCreating,
		isUpdating,
		isDeleting,
		createError,
		updateError,
	} = useLocationsPage();

	return (
		<div className="mx-auto space-y-6">
			{/* Header */}
			<PageHeader
				title={t('features.locations.list.title')}
				description={t('features.locations.list.description')}
				actions={[
					<Button key="create" onClick={handleAddClick}>
						<PlusIcon className="mr-2 h-4 w-4" />
						{t('features.locations.list.actions.create.button')}
					</Button>,
				]}
			/>

			{/* Search and Filters */}
			<SearchAndFilters
				searchPlaceholder={t('features.locations.list.search.placeholder')}
				searchValue={searchQuery}
				onSearchChange={setSearchQuery}
				filterOptions={filterOptions}
				selectedFilter={selectedFilter}
				onFilterChange={setSelectedFilter}
			/>

			{/* Locations Grid */}
			{isLoading ? (
				<LocationsCardsSkeleton cards={LOCATIONS_PER_PAGE} />
			) : locationsError ? (
				<div className="flex items-center justify-center min-h-[400px]">
					<p className="text-destructive">
						{t('features.locations.list.error.loading', {
							message: locationsError.message,
						})}
					</p>
				</div>
			) : locations && locations.items.length > 0 ? (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{locations.items.map((location) => (
							<LocationCard
								key={location.id}
								location={location}
								onEdit={handleEditClick}
								onDelete={handleDeleteClick}
							/>
						))}
						<LocationAddCard onClick={handleAddClick} />
					</div>

					{/* Pagination */}
					{locations.totalPages > 1 && (
						<>
							<div className="text-sm text-muted-foreground text-center">
								{t('shared.pagination.info', {
									page: locations.page,
									totalPages: locations.totalPages,
									total: locations.total,
								})}
							</div>
							<PaginatedResults
								currentPage={locations.page}
								totalPages={locations.totalPages}
								onPageChange={handlePageChange}
							/>
						</>
					)}
				</>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<LocationAddCard onClick={handleAddClick} />
				</div>
			)}

			{/* Create Dialog */}
			<LocationCreateForm
				open={createDialogOpen}
				onOpenChange={setCreateDialogOpen}
				onSubmit={handleCreateSubmit}
				isLoading={isCreating}
				error={createError}
			/>

			{/* Update Dialog */}
			<LocationUpdateForm
				location={selectedLocation}
				open={updateDialogOpen}
				onOpenChange={setUpdateDialogOpen}
				onSubmit={handleUpdateSubmit}
				isLoading={isUpdating}
				error={updateError}
			/>

			{/* Delete Dialog */}
			<LocationDeleteDialog
				location={selectedLocation}
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				onConfirm={handleDeleteSubmit}
				isLoading={isDeleting}
			/>
		</div>
	);
}
