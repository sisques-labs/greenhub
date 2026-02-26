'use client';

import type { PlantSpeciesResponse } from '@/features/plant-species/api/types/plant-species-response.types';
import {
	PlantSpeciesCategory,
	PlantSpeciesDifficulty,
} from '@/features/plant-species/api/types/plant-species.types';
import { PlantSpeciesCard } from '@/features/plant-species/components/cards/PlantSpeciesCard/PlantSpeciesCard';
import { PlantSpeciesCreateModal } from '@/features/plant-species/components/modals/PlantSpeciesCreateModal/PlantSpeciesCreateModal';
import { PlantSpeciesDeleteModal } from '@/features/plant-species/components/modals/PlantSpeciesDeleteModal/PlantSpeciesDeleteModal';
import { PlantSpeciesUpdateForm } from '@/features/plant-species/components/forms/PlantSpeciesUpdateForm/PlantSpeciesUpdateForm';
import { PlantSpeciesTable } from '@/features/plant-species/components/tables/PlantSpeciesTable/PlantSpeciesTable';
import { PLANT_SPECIES_CATEGORIES } from '@/features/plant-species/constants/plant-species-categories';
import { PLANT_SPECIES_DIFFICULTY } from '@/features/plant-species/constants/plant-species-difficulty';
import { usePlantSpeciesCreate } from '@/features/plant-species/hooks/use-plant-species-create/use-plant-species-create';
import { usePlantSpeciesDelete } from '@/features/plant-species/hooks/use-plant-species-delete/use-plant-species-delete';
import { usePlantSpeciesUpdate } from '@/features/plant-species/hooks/use-plant-species-update/use-plant-species-update';
import { usePlantSpeciesListPage } from '@/features/plant-species/hooks/pages/usePlantSpeciesListPage';
import type { PlantSpeciesCreateFormValues } from '@/features/plant-species/schemas/plant-species-create.schema';
import type { PlantSpeciesUpdateFormValues } from '@/features/plant-species/schemas/plant-species-update.schema';
import { PageHeader } from '@/shared/components/organisms/page-header';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/shared/components/ui/select';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { LayoutGridIcon, ListIcon, PlusIcon, SearchIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export function PlantSpeciesListPage() {
	const t = useTranslations();
	const locale = useLocale();
	const router = useRouter();

	const {
		species,
		isLoading,
		error,
		filters,
		handleFilterChange,
		handleClearFilters,
		viewMode,
		setViewMode,
	} = usePlantSpeciesListPage();

	// Dialog state
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedSpecies, setSelectedSpecies] =
		useState<PlantSpeciesResponse | null>(null);
	const [selectedDeleteSpecies, setSelectedDeleteSpecies] =
		useState<PlantSpeciesResponse | null>(null);

	// CRUD hooks
	const {
		handleCreate,
		isLoading: isCreating,
		error: createError,
	} = usePlantSpeciesCreate();
	const {
		handleUpdate,
		isLoading: isUpdating,
		error: updateError,
	} = usePlantSpeciesUpdate();
	const { handleDelete, isLoading: isDeleting } = usePlantSpeciesDelete();

	// Handlers
	const handleCreateSubmit = useCallback(
		async (values: PlantSpeciesCreateFormValues) => {
			await handleCreate(
				values as Parameters<typeof handleCreate>[0],
				() => {
					setCreateDialogOpen(false);
					toast.success(
						t('features.plantSpecies.list.actions.create.success'),
					);
				},
				() => {
					toast.error(t('features.plantSpecies.list.actions.create.error'));
				},
			);
		},
		[handleCreate, t],
	);

	const handleUpdateSubmit = useCallback(
		async (values: PlantSpeciesUpdateFormValues) => {
			if (!selectedSpecies) return;
			await handleUpdate(
				{
					...(values as Parameters<typeof handleUpdate>[0]),
					id: selectedSpecies.id,
				},
				() => {
					setUpdateDialogOpen(false);
					setSelectedSpecies(null);
					toast.success(
						t('features.plantSpecies.list.actions.update.success'),
					);
				},
				() => {
					toast.error(t('features.plantSpecies.list.actions.update.error'));
				},
			);
		},
		[handleUpdate, selectedSpecies, t],
	);

	const handleDeleteConfirm = useCallback(async () => {
		if (!selectedDeleteSpecies) return;
		await handleDelete(
			selectedDeleteSpecies.id,
			() => {
				setDeleteDialogOpen(false);
				setSelectedDeleteSpecies(null);
				toast.success(
					t('features.plantSpecies.list.actions.delete.success'),
				);
			},
			() => {
				toast.error(t('features.plantSpecies.list.actions.delete.error'));
			},
		);
	}, [handleDelete, selectedDeleteSpecies, t]);

	const handleEditClick = useCallback((ps: PlantSpeciesResponse) => {
		setSelectedSpecies(ps);
		setUpdateDialogOpen(true);
	}, []);

	const handleDeleteClick = useCallback((id: string) => {
		const ps = species.find((s) => s.id === id) ?? null;
		setSelectedDeleteSpecies(ps);
		setDeleteDialogOpen(true);
	}, [species]);

	const handleViewClick = useCallback(
		(ps: PlantSpeciesResponse) => {
			router.push(`/${locale}/plant-species/${ps.id}`);
		},
		[router, locale],
	);

	const hasActiveFilters =
		filters.category !== undefined ||
		filters.difficulty !== undefined ||
		filters.search !== '' ||
		filters.verifiedOnly;

	// Loading state
	if (isLoading) {
		return (
			<div className="mx-auto space-y-6">
				<div className="flex items-center justify-between">
					<Skeleton className="h-8 w-48" />
					<Skeleton className="h-9 w-32" />
				</div>
				<div className="flex gap-3">
					<Skeleton className="h-9 flex-1" />
					<Skeleton className="h-9 w-40" />
					<Skeleton className="h-9 w-36" />
					<Skeleton className="h-9 w-28" />
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{Array.from({ length: 8 }).map((_, i) => (
						<Skeleton key={i} className="h-64" />
					))}
				</div>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className="mx-auto py-8">
				<div className="flex items-center justify-center min-h-[400px]">
					<p className="text-destructive">
						{t('features.plantSpecies.list.error.loading', {
							message: (error as Error)?.message ?? 'Unknown error',
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
				title={t('features.plantSpecies.list.title')}
				description={t('features.plantSpecies.list.description')}
				actions={[
					<Button key="create" onClick={() => setCreateDialogOpen(true)}>
						<PlusIcon className="mr-2 h-4 w-4" />
						{t('features.plantSpecies.list.actions.create.button')}
					</Button>,
				]}
			/>

			{/* Filters */}
			<div className="flex flex-wrap gap-3 items-center">
				{/* Search */}
				<div className="relative flex-1 min-w-[200px]">
					<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder={t('features.plantSpecies.list.searchPlaceholder')}
						value={filters.search}
						onChange={(e) => handleFilterChange('search', e.target.value)}
						className="pl-9"
					/>
				</div>

				{/* Category filter */}
				<Select
					value={filters.category ?? 'all'}
					onValueChange={(v) =>
						handleFilterChange(
							'category',
							v === 'all' ? undefined : (v as PlantSpeciesCategory),
						)
					}
				>
					<SelectTrigger className="w-44">
						<SelectValue
							placeholder={t(
								'features.plantSpecies.list.filters.allCategories',
							)}
						/>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">
							{t('features.plantSpecies.list.filters.allCategories')}
						</SelectItem>
						{Object.values(PlantSpeciesCategory).map((cat) => (
							<SelectItem key={cat} value={cat}>
								{PLANT_SPECIES_CATEGORIES[cat].icon}{' '}
								{PLANT_SPECIES_CATEGORIES[cat].label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* Difficulty filter */}
				<Select
					value={filters.difficulty ?? 'all'}
					onValueChange={(v) =>
						handleFilterChange(
							'difficulty',
							v === 'all' ? undefined : (v as PlantSpeciesDifficulty),
						)
					}
				>
					<SelectTrigger className="w-40">
						<SelectValue
							placeholder={t(
								'features.plantSpecies.list.filters.allDifficulties',
							)}
						/>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">
							{t('features.plantSpecies.list.filters.allDifficulties')}
						</SelectItem>
						{Object.values(PlantSpeciesDifficulty).map((diff) => (
							<SelectItem key={diff} value={diff}>
								{PLANT_SPECIES_DIFFICULTY[diff].icon}{' '}
								{PLANT_SPECIES_DIFFICULTY[diff].label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* Verified Only toggle */}
				<div className="flex items-center gap-2">
					<Checkbox
						id="verified-only"
						checked={filters.verifiedOnly}
						onCheckedChange={(checked) =>
							handleFilterChange('verifiedOnly', Boolean(checked))
						}
					/>
					<label htmlFor="verified-only" className="text-sm cursor-pointer whitespace-nowrap">
						{t('features.plantSpecies.list.filters.verifiedOnly')}
					</label>
				</div>

				{/* View mode toggle */}
				<div className="ml-auto flex gap-1">
					<Button
						variant={viewMode === 'grid' ? 'default' : 'outline'}
						size="icon"
						onClick={() => setViewMode('grid')}
						title="Grid view"
					>
						<LayoutGridIcon className="h-4 w-4" />
					</Button>
					<Button
						variant={viewMode === 'table' ? 'default' : 'outline'}
						size="icon"
						onClick={() => setViewMode('table')}
						title="Table view"
					>
						<ListIcon className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Content */}
			{species.length === 0 ? (
				/* Empty state */
				<div className="flex flex-col items-center justify-center min-h-[300px] text-center space-y-3 py-12">
					<div className="text-5xl">🌱</div>
					<h3 className="text-lg font-semibold">
						{t('features.plantSpecies.list.empty')}
					</h3>
					<p className="text-sm text-muted-foreground max-w-xs">
						{t('features.plantSpecies.list.emptyDescription')}
					</p>
					{hasActiveFilters && (
						<Button variant="outline" onClick={handleClearFilters}>
							{t('features.plantSpecies.list.filters.clearFilters')}
						</Button>
					)}
				</div>
			) : viewMode === 'grid' ? (
				/* Grid View */
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{species.map((ps) => (
						<PlantSpeciesCard
							key={ps.id}
							plantSpecies={ps}
							onView={handleViewClick}
							onEdit={handleEditClick}
							onDelete={handleDeleteClick}
						/>
					))}
				</div>
			) : (
				/* Table View */
				<PlantSpeciesTable
					plantSpecies={species}
					onView={handleViewClick}
					onEdit={handleEditClick}
					onDelete={handleDeleteClick}
				/>
			)}

			{/* Create Modal */}
			<PlantSpeciesCreateModal
				open={createDialogOpen}
				onOpenChange={setCreateDialogOpen}
				onSubmit={handleCreateSubmit}
				isLoading={isCreating}
				error={createError}
			/>

			{/* Update Form */}
			<PlantSpeciesUpdateForm
				plantSpecies={selectedSpecies}
				open={updateDialogOpen}
				onOpenChange={setUpdateDialogOpen}
				onSubmit={handleUpdateSubmit}
				isLoading={isUpdating}
				error={updateError}
			/>

			{/* Delete Modal */}
			<PlantSpeciesDeleteModal
				plantSpecies={selectedDeleteSpecies}
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				onConfirm={handleDeleteConfirm}
				isLoading={isDeleting}
			/>
		</div>
	);
}
