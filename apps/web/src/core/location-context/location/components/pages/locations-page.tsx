'use client';

import { LocationCard } from '@/core/location-context/location/components/organisms/location-card/location-card';
import { LocationCreateForm } from '@/core/location-context/location/components/organisms/location-create-form/location-create-form';
import { LocationsPageSkeleton } from '@/core/location-context/location/components/organisms/locations-page-skeleton/locations-page-skeleton';
import { useLocationsPage } from '@/core/location-context/location/hooks/use-locations-page/use-locations-page';
import { PaginatedResults } from '@/shared/components/ui/paginated-results/paginated-results';
import { SearchAndFilters } from '@/shared/components/ui/search-and-filters/search-and-filters';
import { PageHeader } from '@repo/shared/presentation/components/organisms/page-header';
import { Button } from '@repo/shared/presentation/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function LocationsPage() {
	const t = useTranslations();
	const {
		createDialogOpen,
		setCreateDialogOpen,
		searchQuery,
		setSearchQuery,
		selectedFilter,
		setSelectedFilter,
		filterOptions,
		locations,
		isLoading,
		locationsError,
		handleCreateSubmit,
		handleAddClick,
		handlePageChange,
		isCreating,
		createError,
	} = useLocationsPage();

	if (isLoading) {
		return <LocationsPageSkeleton />;
	}

	if (locationsError) {
		return (
			<div className="mx-auto py-8">
				<div className="flex items-center justify-center min-h-[400px]">
					<p className="text-destructive">
						{t('pages.locations.list.error.loading', {
							message: locationsError.message,
						})}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto space-y-6">
			{/* Header */}
			<PageHeader
				title={t('pages.locations.list.title')}
				description={t('pages.locations.list.description')}
				actions={[
					<Button key="create" onClick={handleAddClick}>
						<PlusIcon className="mr-2 h-4 w-4" />
						{t('pages.locations.list.actions.create.button')}
					</Button>,
				]}
			/>

			{/* Search and Filters */}
			<SearchAndFilters
				searchPlaceholder={t('pages.locations.list.search.placeholder')}
				searchValue={searchQuery}
				onSearchChange={setSearchQuery}
				filterOptions={filterOptions}
				selectedFilter={selectedFilter}
				onFilterChange={setSelectedFilter}
			/>

			{/* Locations Grid */}
			{locations && locations.items.length > 0 ? (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{locations.items.map((location) => (
							<LocationCard key={location.id} location={location} />
						))}
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
				<div className="flex items-center justify-center min-h-[400px]">
					<p className="text-muted-foreground">
						{t('pages.locations.list.empty')}
					</p>
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
		</div>
	);
}

