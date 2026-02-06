'use client';

import { PageHeader } from '@repo/shared/presentation/components/organisms/page-header';
import { TableLayout } from '@repo/shared/presentation/components/organisms/table-layout';
import { Button } from '@repo/shared/presentation/components/ui/button';
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from '@repo/shared/presentation/components/ui/table';
import { PlantCreateForm } from 'features/plants/components/organisms/plant-create-form/plant-create-form';
import { PlantTableRow } from 'features/plants/components/organisms/plant-table-row/plant-table-row';
import { PlantsTableSkeleton } from 'features/plants/components/organisms/plants-table-skeleton/plants-table-skeleton';
import { usePlantsPage } from 'features/plants/hooks/use-plants-page/use-plants-page';
import {
	Building2Icon,
	CheckCircleIcon,
	DropletsIcon,
	HomeIcon,
	PlusIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
	type FilterOption,
	SearchAndFilters,
} from 'shared/components/ui/search-and-filters/search-and-filters';

export function PlantsPage() {
	const t = useTranslations();

	const {
		searchQuery,
		setSearchQuery,
		selectedFilter,
		setSelectedFilter,
		currentPage,
		perPage,
		setPerPage,
		createDialogOpen,
		setCreateDialogOpen,
		allFilteredPlants,
		paginatedPlants,
		totalPages,
		isLoading,
		error,
		handleCreateSubmit,
		handleAddClick,
		handleEdit,
		handleDelete,
		handlePageChange,
		hasAnyPlants,
		growingUnits,
		isCreating,
		createError,
	} = usePlantsPage();

	const filterOptions: FilterOption[] = [
		{ value: 'all', label: t('pages.plants.list.filters.all') },
		{
			value: 'indoor',
			label: t('pages.plants.list.filters.indoor'),
			icon: HomeIcon,
		},
		{
			value: 'outdoor',
			label: t('pages.plants.list.filters.outdoor'),
			icon: Building2Icon,
		},
		{
			value: 'needsWater',
			label: t('pages.plants.list.filters.needsWater'),
			icon: DropletsIcon,
		},
		{
			value: 'healthy',
			label: t('pages.plants.list.filters.healthy'),
			icon: CheckCircleIcon,
		},
	];

	return (
		<div className="mx-auto space-y-6">
			{/* Header */}
			<PageHeader
				title={t('pages.plants.list.title')}
				description={t('pages.plants.list.description')}
				actions={[
					<Button key="create" onClick={handleAddClick}>
						<PlusIcon className="mr-2 h-4 w-4" />
						{t('pages.plants.list.actions.create.button')}
					</Button>,
				]}
			/>

			{/* Search and Filters */}
			<SearchAndFilters
				searchPlaceholder={t('pages.plants.list.search.placeholder')}
				searchValue={searchQuery}
				onSearchChange={setSearchQuery}
				filterOptions={filterOptions}
				selectedFilter={selectedFilter}
				onFilterChange={setSelectedFilter}
			/>

			{/* Plants Table with Pagination */}
			<TableLayout
				page={currentPage}
				totalPages={totalPages}
				onPageChange={handlePageChange}
				perPage={perPage}
				onPerPageChange={setPerPage}
			>
				{isLoading ? (
					<PlantsTableSkeleton rows={perPage} />
				) : error ? (
					<div className="flex items-center justify-center min-h-[400px]">
						<p className="text-destructive">
							{t('pages.plants.list.error.loading', {
								message: (error as Error).message,
							})}
						</p>
					</div>
				) : paginatedPlants.length > 0 ? (
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[80px]">IMG</TableHead>
									<TableHead>
										{t('pages.plants.list.table.columns.plant')}
									</TableHead>
									<TableHead>
										{t('pages.plants.list.table.columns.location')}
									</TableHead>
									<TableHead>
										{t('pages.plants.list.table.columns.status')}
									</TableHead>
									<TableHead>
										{t('pages.plants.list.table.columns.lastWatering')}
									</TableHead>
									<TableHead className="w-[80px]">
										{t('pages.plants.list.table.columns.actions')}
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{paginatedPlants.map((plant) => (
									<PlantTableRow
										key={plant.id}
										plant={plant}
										growingUnitName={plant.growingUnitName}
										onEdit={handleEdit}
										onDelete={handleDelete}
									/>
								))}
							</TableBody>
						</Table>
					</div>
				) : (
					<div className="flex items-center justify-center min-h-[400px]">
						<p className="text-muted-foreground">
							{hasAnyPlants
								? t('pages.plants.list.empty.filtered')
								: t('pages.plants.list.empty')}
						</p>
					</div>
				)}
			</TableLayout>

			{/* Create Plant Form */}
			<PlantCreateForm
				open={createDialogOpen}
				onOpenChange={setCreateDialogOpen}
				onSubmit={handleCreateSubmit}
				isLoading={isCreating}
				error={createError}
				growingUnits={
					growingUnits?.items.map((unit: { id: string; name: string }) => ({
						id: unit.id,
						name: unit.name,
					})) || []
				}
			/>
		</div>
	);
}
