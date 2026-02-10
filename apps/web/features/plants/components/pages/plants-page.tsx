'use client';

import { PlantCreateForm } from '@/features/plants/components/organisms/plant-create-form/plant-create-form';
import { usePlantsPage } from '@/features/plants/hooks/use-plants-page/use-plants-page';
import { formatPlantDate } from '@/shared/lib/date-utils';
import { getLocationIcon } from '@/shared/lib/icon-utils';
import { getPlantInitials } from '@/shared/lib/string-utils';
import { DEFAULT_PER_PAGE_OPTIONS } from '@/shared/constants/pagination.constants';
import { PageHeader } from '@/shared/components/organisms/page-header';
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import {
	type ColumnDef,
	DataTable,
} from '@/shared/components/ui/data-table';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
	type FilterOption,
	SearchAndFilters,
} from '@/shared/components/ui/search-and-filters/search-and-filters';
import { getPlantStatusBadge } from 'features/plants/utils/plant-status.utils';
import {
	Building2Icon,
	CheckCircleIcon,
	DropletsIcon,
	HomeIcon,
	MoreVerticalIcon,
	PlusIcon,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import type { PlantResponse } from '../../api/types';

export function PlantsPage() {
	const t = useTranslations();
	const locale = useLocale();
	const router = useRouter();

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

	const plantsColumns: ColumnDef<PlantResponse>[] = [
		{
			id: 'avatar',
			header: 'IMG',
			headerClassName: 'w-[80px]',
			cell: (plant) => (
				<Avatar className="h-10 w-10">
					<AvatarImage src={undefined} alt={plant.name || plant.species} />
					<AvatarFallback>
						{getPlantInitials(plant.name, plant.species)}
					</AvatarFallback>
				</Avatar>
			),
		},
		{
			id: 'plant',
			header: t('features.plants.list.table.columns.plant'),
			cell: (plant) => (
				<div>
					<div className="font-medium">
						{plant.name || t('features.plants.detail.unnamed')}
					</div>
					<div className="text-sm text-muted-foreground">
						{plant.species || '-'}
					</div>
				</div>
			),
		},
		{
			id: 'location',
			header: t('features.plants.list.table.columns.location'),
			cell: (plant) =>
				plant.location ? (
					<div className="flex items-center gap-2">
						{getLocationIcon()}
						<span className="text-sm">{plant.location.name}</span>
					</div>
				) : (
					<div className="flex items-center gap-2">
						{getLocationIcon()}
						<span className="text-sm text-muted-foreground">
							{t('common.unknown')}
						</span>
					</div>
				),
		},
		{
			id: 'status',
			header: t('features.plants.list.table.columns.status'),
			cell: (plant) => getPlantStatusBadge(plant.status, t),
		},
		{
			id: 'lastWatering',
			header: t('features.plants.list.table.columns.lastWatering'),
			cell: (plant) => (
				<span className="text-sm text-muted-foreground">
					{formatPlantDate(plant.updatedAt, {
						today: t('features.plants.list.table.lastWatering.today'),
						yesterday: t('features.plants.list.table.lastWatering.yesterday'),
						daysAgo: (days: number) =>
							t('features.plants.list.table.lastWatering.daysAgo', { days }),
						weeksAgo: (weeks: number) =>
							t('features.plants.list.table.lastWatering.weeksAgo', { weeks }),
					})}
				</span>
			),
		},
		{
			id: 'actions',
			header: t('features.plants.list.table.columns.actions'),
			headerClassName: 'w-[80px]',
			cell: (plant) => (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button
							className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent"
							onClick={(e) => e.stopPropagation()}
						>
							<MoreVerticalIcon className="h-4 w-4" />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						onClick={(e) => e.stopPropagation()}
					>
						<DropdownMenuItem
							onClick={(e) => {
								e.stopPropagation();
								router.push(`/${locale}/plants/${plant.id}`);
							}}
						>
							{t('features.plants.list.actions.view')}
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={(e) => {
								e.stopPropagation();
								handleEdit(plant);
							}}
						>
							{t('features.plants.list.actions.edit')}
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={(e) => {
								e.stopPropagation();
								handleDelete(plant.id);
							}}
							className="text-destructive"
						>
							{t('features.plants.list.actions.delete')}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			),
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

			{/* Plants Table */}
			{error ? (
				<div className="flex items-center justify-center min-h-[400px]">
					<p className="text-destructive">
						{t('features.plants.list.error.loading', {
							message: (error as Error).message,
						})}
					</p>
				</div>
			) : (
				<DataTable
					data={paginatedPlants}
					columns={plantsColumns}
					isLoading={isLoading}
					paginated
					page={currentPage}
					totalPages={totalPages}
					onPageChange={handlePageChange}
					perPage={perPage}
					perPageOptions={DEFAULT_PER_PAGE_OPTIONS}
					onPerPageChange={setPerPage}
					onRowClick={(plant) => router.push(`/${locale}/plants/${plant.id}`)}
					getRowId={(plant) => plant.id}
					emptyMessage={
						hasAnyPlants
							? t('features.plants.list.empty.filtered')
							: t('features.plants.list.empty')
					}
					bordered
					rowClassName="hover:bg-muted/50 transition-colors"
				/>
			)}

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
