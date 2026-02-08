'use client';

import { PageHeader } from '@/shared/components/organisms/page-header';
import { TableLayout } from '@/shared/components/organisms/table-layout';
import { Button } from '@/shared/components/ui/button';
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from '@/shared/components/ui/table';
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
		transformedGrowingUnits,
		isCreating,
		createError,
	} = usePlantsPage();

	const filterOptions: FilterOption[] = [
		{ value: 'all', label: t('features.plants.list.filters.all') },
		{
			value: 'indoor',
			label: t('features.plants.list.filters.indoor'),
			icon: HomeIcon,
		},
		{
			value: 'outdoor',
			label: t('features.plants.list.filters.outdoor'),
			icon: Building2Icon,
		},
		{
			value: 'needsWater',
			label: t('features.plants.list.filters.needsWater'),
			icon: DropletsIcon,
		},
		{
			value: 'healthy',
			label: t('features.plants.list.filters.healthy'),
			icon: CheckCircleIcon,
		},
	];

	return (
		<div className="mx-auto space-y-6">
			{/* Header */}
			<PageHeader
				title={t('features.plants.list.title')}
				description={t('features.plants.list.description')}
				actions={[
					<Button key="create" onClick={handleAddClick}>
						<PlusIcon className="mr-2 h-4 w-4" />
						{t('features.plants.list.actions.create.button')}
					</Button>,
				]}
			/>

			{/* Search and Filters */}
			<SearchAndFilters
				searchPlaceholder={t('features.plants.list.search.placeholder')}
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
							{t('features.plants.list.error.loading', {
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
										{t('features.plants.list.table.columns.plant')}
									</TableHead>
									<TableHead>
										{t('features.plants.list.table.columns.location')}
									</TableHead>
									<TableHead>
										{t('features.plants.list.table.columns.status')}
									</TableHead>
									<TableHead>
										{t('features.plants.list.table.columns.lastWatering')}
									</TableHead>
									<TableHead className="w-[80px]">
										{t('features.plants.list.table.columns.actions')}
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{paginatedPlants.map((plant) => (
									<PlantTableRow
										key={plant.id}
										plant={plant}
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
								? t('features.plants.list.empty.filtered')
								: t('features.plants.list.empty')}
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
				growingUnits={transformedGrowingUnits}
			/>
		</div>
	);
}
