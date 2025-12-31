'use client';

import type { GrowingUnitResponse } from '@repo/sdk';
import { PageHeader } from '@repo/shared/presentation/components/organisms/page-header';
import { Button } from '@repo/shared/presentation/components/ui/button';
import {
	Building2Icon,
	FlowerIcon,
	HomeIcon,
	PackageIcon,
	PlusIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { GrowingUnitAddCard } from '@/core/plant-context/growing-unit/components/organisms/growing-unit-add-card/growing-unit-add-card';
import { GrowingUnitCard } from '@/core/plant-context/growing-unit/components/organisms/growing-unit-card/growing-unit-card';
import { GrowingUnitCreateForm } from '@/core/plant-context/growing-unit/components/organisms/growing-unit-create-form/growing-unit-create-form';
import { GrowingUnitUpdateForm } from '@/core/plant-context/growing-unit/components/organisms/growing-unit-update-form/growing-unit-update-form';
import { GrowingUnitsPageSkeleton } from '@/core/plant-context/growing-unit/components/organisms/growing-units-page-skeleton/growing-units-page-skeleton';
import type { GrowingUnitCreateFormValues } from '@/core/plant-context/growing-unit/dtos/schemas/growing-unit-create/growing-unit-create.schema';
import type { GrowingUnitUpdateFormValues } from '@/core/plant-context/growing-unit/dtos/schemas/growing-unit-update/growing-unit-update.schema';
import { useGrowingUnitCreate } from '@/core/plant-context/growing-unit/hooks/use-growing-unit-create/use-growing-unit-create';
import { useGrowingUnitDelete } from '@/core/plant-context/growing-unit/hooks/use-growing-unit-delete/use-growing-unit-delete';
import { useGrowingUnitUpdate } from '@/core/plant-context/growing-unit/hooks/use-growing-unit-update/use-growing-unit-update';
import { useGrowingUnitsFindByCriteria } from '@/core/plant-context/growing-unit/hooks/use-growing-units-find-by-criteria/use-growing-units-find-by-criteria';
import { useGrowingUnitsPageStore } from '@/core/plant-context/growing-unit/stores/growing-units-page-store';
import { PaginatedResults } from '@/shared/components/ui/paginated-results/paginated-results';
import {
	type FilterOption,
	SearchAndFilters,
} from '@/shared/components/ui/search-and-filters/search-and-filters';

export function GrowingUnitsPage() {
	const t = useTranslations();
	const {
		createDialogOpen,
		setCreateDialogOpen,
		updateDialogOpen,
		setUpdateDialogOpen,
		selectedGrowingUnit,
		setSelectedGrowingUnit,
		searchQuery,
		setSearchQuery,
		selectedFilter,
		setSelectedFilter,
		currentPage,
		setCurrentPage,
	} = useGrowingUnitsPageStore();

	const paginationInput = useMemo(
		() => ({
			pagination: {
				page: currentPage,
				perPage: 12,
			},
		}),
		[currentPage],
	);

	const {
		growingUnits,
		isLoading: isLoadingGrowingUnits,
		error: growingUnitsError,
		refetch,
	} = useGrowingUnitsFindByCriteria(paginationInput);

	const {
		handleCreate,
		isLoading: isCreating,
		error: createError,
	} = useGrowingUnitCreate();

	const {
		handleUpdate,
		isLoading: isUpdating,
		error: updateError,
	} = useGrowingUnitUpdate();

	const { handleDelete } = useGrowingUnitDelete();

	const filterOptions: FilterOption[] = [
		{ value: 'all', label: t('pages.growingUnits.list.filters.all') },
		{
			value: 'indoor',
			label: t('pages.growingUnits.list.filters.indoor'),
			icon: HomeIcon,
		},
		{
			value: 'outdoor',
			label: t('pages.growingUnits.list.filters.outdoor'),
			icon: Building2Icon,
		},
		{
			value: 'pots',
			label: t('pages.growingUnits.list.filters.pots'),
			icon: FlowerIcon,
		},
		{
			value: 'beds',
			label: t('pages.growingUnits.list.filters.beds'),
			icon: PackageIcon,
		},
	];

	const handleCreateSubmit = async (values: GrowingUnitCreateFormValues) => {
		await handleCreate(values, () => {
			refetch();
			setCreateDialogOpen(false);
		});
	};

	const handleUpdateSubmit = async (values: GrowingUnitUpdateFormValues) => {
		await handleUpdate(values, () => {
			refetch();
			setUpdateDialogOpen(false);
			setSelectedGrowingUnit(null);
		});
	};

	const _handleEdit = (growingUnit: GrowingUnitResponse) => {
		setSelectedGrowingUnit(growingUnit);
		setUpdateDialogOpen(true);
	};

	const _handleDeleteConfirm = async (id: string) => {
		await handleDelete(id, () => {
			refetch();
		});
	};

	const handleAddClick = () => {
		setCreateDialogOpen(true);
	};

	// Show skeleton while loading or if data is not yet available
	if (isLoadingGrowingUnits || growingUnits === null || growingUnits === undefined) {
		return <GrowingUnitsPageSkeleton />;
	}

	if (growingUnitsError) {
		return (
			<div className="mx-auto py-8">
				<div className="flex items-center justify-center min-h-[400px]">
					<p className="text-destructive">
						{t('pages.growingUnits.list.error.loading', {
							message: growingUnitsError.message,
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
			{growingUnits && growingUnits.items.length > 0 ? (
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
								onPageChange={(page) => {
									setCurrentPage(page);
									// Scroll to top when page changes
									window.scrollTo({ top: 0, behavior: 'smooth' });
								}}
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

			{/* Update Dialog */}
			<GrowingUnitUpdateForm
				growingUnit={selectedGrowingUnit}
				open={updateDialogOpen}
				onOpenChange={(open) => {
					setUpdateDialogOpen(open);
					if (!open) {
						setSelectedGrowingUnit(null);
					}
				}}
				onSubmit={handleUpdateSubmit}
				isLoading={isUpdating}
				error={updateError}
			/>
		</div>
	);
}
