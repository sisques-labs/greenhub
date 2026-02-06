'use client';

import { PageHeader } from '@repo/shared/presentation/components/organisms/page-header';
import { Button } from '@repo/shared/presentation/components/ui/button';
import { GrowingUnitAddCard } from 'features/growing-units/components/organisms/growing-unit-add-card/growing-unit-add-card';
import { GrowingUnitCard } from 'features/growing-units/components/organisms/growing-unit-card/growing-unit-card';
import { GrowingUnitCreateForm } from 'features/growing-units/components/organisms/growing-unit-create-form/growing-unit-create-form';
import { GrowingUnitsCardsSkeleton } from 'features/growing-units/components/organisms/growing-units-cards-skeleton/growing-units-cards-skeleton';
import { useGrowingUnitsPage } from 'features/growing-units/hooks/use-growing-units-page/use-growing-units-page';
import { PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PaginatedResults } from 'shared/components/ui/paginated-results/paginated-results';
import { SearchAndFilters } from 'shared/components/ui/search-and-filters/search-and-filters';

const GROWING_UNITS_PER_PAGE = 12;

export function GrowingUnitsPage() {
	const t = useTranslations();
	const {
		createDialogOpen,
		setCreateDialogOpen,
		searchQuery,
		setSearchQuery,
		selectedFilter,
		setSelectedFilter,
		filterOptions,
		growingUnits,
		isLoading,
		growingUnitsError,
		handleCreateSubmit,
		handleAddClick,
		handlePageChange,
		isCreating,
		createError,
	} = useGrowingUnitsPage();

	return (
		<div className="mx-auto space-y-6">
			{/* Header */}
			<PageHeader
				title={t('pages.growingUnits.list.title')}
				description={t('pages.growingUnits.list.description')}
				actions={[
					<Button key="create" onClick={handleAddClick}>
						<PlusIcon className="mr-2 h-4 w-4" />
						{t('pages.growingUnits.list.actions.create.button')}
					</Button>,
				]}
			/>

			{/* Search and Filters */}
			<SearchAndFilters
				searchPlaceholder={t('pages.growingUnits.list.search.placeholder')}
				searchValue={searchQuery}
				onSearchChange={setSearchQuery}
				filterOptions={filterOptions}
				selectedFilter={selectedFilter}
				onFilterChange={setSelectedFilter}
			/>

			{/* Growing Units Grid */}
			{isLoading ? (
				<GrowingUnitsCardsSkeleton cards={GROWING_UNITS_PER_PAGE} />
			) : growingUnitsError ? (
				<div className="flex items-center justify-center min-h-[400px]">
					<p className="text-destructive">
						{t('pages.growingUnits.list.error.loading', {
							message: growingUnitsError.message,
						})}
					</p>
				</div>
			) : growingUnits && growingUnits.items.length > 0 ? (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{growingUnits.items.map((growingUnit) => (
							<GrowingUnitCard key={growingUnit.id} growingUnit={growingUnit} />
						))}
						<GrowingUnitAddCard onClick={handleAddClick} />
					</div>

					{/* Pagination */}
					{growingUnits.totalPages > 1 && (
						<>
							<div className="text-sm text-muted-foreground text-center">
								{t('shared.pagination.info', {
									page: growingUnits.page,
									totalPages: growingUnits.totalPages,
									total: growingUnits.total,
								})}
							</div>
							<PaginatedResults
								currentPage={growingUnits.page}
								totalPages={growingUnits.totalPages}
								onPageChange={handlePageChange}
							/>
						</>
					)}
				</>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<GrowingUnitAddCard onClick={handleAddClick} />
				</div>
			)}

			{/* Create Dialog */}
			<GrowingUnitCreateForm
				open={createDialogOpen}
				onOpenChange={setCreateDialogOpen}
				onSubmit={handleCreateSubmit}
				isLoading={isCreating}
				error={createError}
			/>
		</div>
	);
}
