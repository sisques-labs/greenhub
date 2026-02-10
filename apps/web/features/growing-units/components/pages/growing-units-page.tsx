'use client';

import type { GrowingUnitResponse } from '@/features/growing-units/api/types';
import { GrowingUnitCreateForm } from '@/features/growing-units/components/organisms/growing-unit-create-form/growing-unit-create-form';
import { useGrowingUnitsPage } from '@/features/growing-units/hooks/use-growing-units-page/use-growing-units-page';
import { DEFAULT_PER_PAGE_OPTIONS } from '@/shared/constants/pagination.constants';
import { PageHeader } from '@/shared/components/organisms/page-header';
import { Button } from '@/shared/components/ui/button';
import { type ColumnDef, DataTable } from '@/shared/components/ui/data-table';
import { SearchAndFilters } from '@/shared/components/ui/search-and-filters/search-and-filters';
import { PlusIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export function GrowingUnitsPage() {
	const t = useTranslations();
	const locale = useLocale();
	const router = useRouter();

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
		perPage,
		setPerPage,
	} = useGrowingUnitsPage();

	const growingUnitsColumns: ColumnDef<GrowingUnitResponse>[] = [
		{
			id: 'unit',
			header: t('features.growingUnits.list.table.columns.unit', {
				default: 'Unidad de cultivo',
			}),
			cell: (growingUnit) => (
				<div>
					<div className="font-medium">{growingUnit.name}</div>
					<div className="text-sm text-muted-foreground">
						{t(`shared.types.growingUnit.${growingUnit.type}`)}
					</div>
				</div>
			),
		},
		{
			id: 'location',
			header: t('features.growingUnits.list.table.columns.location', {
				default: 'Ubicación',
			}),
			cell: (growingUnit) => {
				const locationLabel =
					growingUnit.type === 'POT' || growingUnit.type === 'WINDOW_BOX'
						? t('features.growingUnits.list.location.indoor', {
								default: 'INTERIOR',
							})
						: t('features.growingUnits.list.location.outdoor', {
								default: 'EXTERIOR',
							});

				return (
					<div>
						<div className="text-sm">{growingUnit.location?.name}</div>
						<div className="text-xs text-muted-foreground uppercase">
							{locationLabel}
						</div>
					</div>
				);
			},
		},
		{
			id: 'plants',
			header: t('features.growingUnits.list.table.columns.plants', {
				default: 'Plantas / Capacidad',
			}),
			cell: (growingUnit) => (
				<div>
					<div className="text-sm font-medium">
						{growingUnit.numberOfPlants} / {growingUnit.capacity}
					</div>
					<div className="text-xs text-muted-foreground">
						{t('features.growingUnits.list.table.plantsCapacity', {
							default: 'plants / capacity',
						})}
					</div>
				</div>
			),
		},
		{
			id: 'updatedAt',
			header: t('features.growingUnits.list.table.columns.updatedAt', {
				default: 'Última actualización',
			}),
			cell: (growingUnit) => (
				<span className="text-sm text-muted-foreground">
					{growingUnit.updatedAt.toLocaleDateString(locale)}
				</span>
			),
		},
	];

	return (
		<div className="mx-auto space-y-6">
			{/* Header */}
			<PageHeader
				title={t('features.growingUnits.list.title')}
				description={t('features.growingUnits.list.description')}
				actions={[
					<Button key="create" onClick={handleAddClick}>
						<PlusIcon className="mr-2 h-4 w-4" />
						{t('features.growingUnits.list.actions.create.button')}
					</Button>,
				]}
			/>

			{/* Search and Filters */}
			<SearchAndFilters
				searchPlaceholder={t('features.growingUnits.list.search.placeholder')}
				searchValue={searchQuery}
				onSearchChange={setSearchQuery}
				filterOptions={filterOptions}
				selectedFilter={selectedFilter}
				onFilterChange={setSelectedFilter}
			/>

			{/* Growing Units Table */}
			{growingUnitsError ? (
				<div className="flex items-center justify-center min-h-[400px]">
					<p className="text-destructive">
						{t('features.growingUnits.list.error.loading', {
							message: growingUnitsError.message,
						})}
					</p>
				</div>
			) : (
				<DataTable
					data={growingUnits?.items ?? []}
					columns={growingUnitsColumns}
					isLoading={isLoading}
					paginated
					page={growingUnits?.page ?? 1}
					totalPages={growingUnits?.totalPages ?? 0}
					onPageChange={handlePageChange}
					perPage={perPage}
					perPageOptions={DEFAULT_PER_PAGE_OPTIONS}
					onPerPageChange={setPerPage}
					onRowClick={(growingUnit) =>
						router.push(`/${locale}/growing-units/${growingUnit.id}`)
					}
					getRowId={(growingUnit) => growingUnit.id}
					emptyMessage={t('features.growingUnits.list.empty', {
						default: 'No hay unidades de cultivo todavía',
					})}
					bordered
					rowClassName="hover:bg-muted/50 transition-colors"
				/>
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
