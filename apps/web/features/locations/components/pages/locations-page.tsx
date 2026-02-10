'use client';

import type { LocationResponse } from '@/features/locations/api/types';
import { LocationCreateForm } from '@/features/locations/components/organisms/location-create-form/location-create-form';
import { LocationDeleteDialog } from '@/features/locations/components/organisms/location-delete-dialog/location-delete-dialog';
import { LocationUpdateForm } from '@/features/locations/components/organisms/location-update-form/location-update-form';
import { useLocationsPage } from '@/features/locations/hooks/use-locations-page/use-locations-page';
import { DEFAULT_PER_PAGE_OPTIONS } from '@/shared/constants/pagination.constants';
import { PageHeader } from '@/shared/components/organisms/page-header';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { type ColumnDef, DataTable } from '@/shared/components/ui/data-table';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { SearchAndFilters } from '@/shared/components/ui/search-and-filters/search-and-filters';
import { MoreVerticalIcon, PlusIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export function LocationsPage() {
	const t = useTranslations();
	const locale = useLocale();
	const router = useRouter();

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
		perPage,
		setPerPage,
	} = useLocationsPage();

	const locationsColumns: ColumnDef<LocationResponse>[] = [
		{
			id: 'name',
			header: t('features.locations.list.table.columns.name', {
				default: 'Name',
			}),
			cell: (location) => (
				<div className="font-medium">{location.name}</div>
			),
		},
		{
			id: 'type',
			header: t('features.locations.list.table.columns.type', {
				default: 'Type',
			}),
			cell: (location) => (
				<Badge
					variant={
						location.type === 'OUTDOOR_SPACE' ||
						location.type === 'GARDEN' ||
						location.type === 'GREENHOUSE' ||
						location.type === 'BALCONY'
							? 'default'
							: 'secondary'
					}
					className="text-xs"
				>
					{t(`shared.types.location.${location.type}`)}
				</Badge>
			),
		},
		{
			id: 'description',
			header: t('features.locations.list.table.columns.description', {
				default: 'Description',
			}),
			cell: (location) => (
				<div className="text-sm text-muted-foreground">
					{location.description || t('features.locations.list.noDescription')}
				</div>
			),
		},
		{
			id: 'actions',
			header: t('features.locations.list.table.columns.actions', {
				default: 'Actions',
			}),
			headerClassName: 'w-[80px]',
			cell: (location) => (
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
								handleEditClick(location);
							}}
						>
							{t('common.edit')}
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={(e) => {
								e.stopPropagation();
								handleDeleteClick(location.id);
							}}
							className="text-destructive"
						>
							{t('common.delete')}
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

			{/* Locations Table */}
			{locationsError ? (
				<div className="flex items-center justify-center min-h-[400px]">
					<p className="text-destructive">
						{t('features.locations.list.error.loading', {
							message: locationsError.message,
						})}
					</p>
				</div>
			) : (
				<DataTable
					data={locations?.items ?? []}
					columns={locationsColumns}
					isLoading={isLoading}
					paginated
					page={locations?.page ?? 1}
					totalPages={locations?.totalPages ?? 0}
					onPageChange={handlePageChange}
					perPage={perPage}
					perPageOptions={DEFAULT_PER_PAGE_OPTIONS}
					onPerPageChange={setPerPage}
					onRowClick={(location) =>
						router.push(`/${locale}/locations/${location.id}`)
					}
					getRowId={(location) => location.id}
					emptyMessage={t('features.locations.list.empty', {
						default: 'No hay ubicaciones todavía',
					})}
					bordered
					rowClassName="hover:bg-muted/50 transition-colors"
				/>
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
