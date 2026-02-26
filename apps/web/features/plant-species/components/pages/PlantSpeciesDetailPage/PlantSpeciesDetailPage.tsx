'use client';

import { PlantSpeciesDetailCard } from '@/features/plant-species/components/cards/PlantSpeciesDetailCard/PlantSpeciesDetailCard';
import { PlantSpeciesDeleteModal } from '@/features/plant-species/components/modals/PlantSpeciesDeleteModal/PlantSpeciesDeleteModal';
import { PlantSpeciesUpdateForm } from '@/features/plant-species/components/forms/PlantSpeciesUpdateForm/PlantSpeciesUpdateForm';
import { usePlantSpeciesDetailPage } from '@/features/plant-species/hooks/pages/usePlantSpeciesDetailPage';
import type { PlantSpeciesUpdateFormValues } from '@/features/plant-species/schemas/plant-species-update.schema';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { ChevronRightIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useState } from 'react';

export function PlantSpeciesDetailPage() {
	const t = useTranslations();
	const locale = useLocale();
	const params = useParams();
	const id = params?.id as string;

	const {
		plantSpecies,
		isLoading,
		error,
		handleUpdate,
		handleDelete,
		isUpdating,
		isDeleting,
	} = usePlantSpeciesDetailPage(id);

	// Dialog state
	const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const handleUpdateSubmit = useCallback(
		async (values: PlantSpeciesUpdateFormValues) => {
			await handleUpdate(
				values as Parameters<typeof handleUpdate>[0],
			);
			setUpdateDialogOpen(false);
		},
		[handleUpdate],
	);

	const handleDeleteConfirm = useCallback(async () => {
		await handleDelete();
	}, [handleDelete]);

	// Loading state
	if (isLoading || plantSpecies === undefined) {
		return (
			<div className="mx-auto space-y-6">
				<div className="flex items-center gap-2">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-4 w-4" />
					<Skeleton className="h-4 w-32" />
				</div>
				<div className="flex items-center justify-between">
					<Skeleton className="h-8 w-48" />
					<div className="flex gap-2">
						<Skeleton className="h-9 w-20" />
						<Skeleton className="h-9 w-20" />
					</div>
				</div>
				<Skeleton className="h-96 w-full" />
			</div>
		);
	}

	// Error state
	if (error || !plantSpecies) {
		return (
			<div className="mx-auto py-8">
				<div className="flex items-center justify-center min-h-[400px]">
					<p className="text-destructive">
						{error
							? t('features.plantSpecies.detail.error.loading', {
									message: (error as Error)?.message ?? 'Unknown error',
								})
							: t('features.plantSpecies.detail.notFound')}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto space-y-6">
			{/* Breadcrumbs */}
			<nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
				<Link
					href={`/${locale}/plant-species`}
					className="hover:text-foreground transition-colors"
				>
					{t('features.plantSpecies.detail.breadcrumbs.speciesLibrary')}
				</Link>
				<ChevronRightIcon className="h-4 w-4" />
				<span className="text-foreground font-medium">
					{plantSpecies.commonName}
				</span>
			</nav>

			{/* Header with actions */}
			<div className="flex items-center justify-between gap-4">
				<h1 className="text-2xl font-bold">{plantSpecies.commonName}</h1>
				<div className="flex gap-2 shrink-0">
					<Button
						variant="outline"
						onClick={() => setUpdateDialogOpen(true)}
					>
						<PencilIcon className="mr-2 h-4 w-4" />
						{t('features.plantSpecies.detail.actions.edit')}
					</Button>
					<Button
						variant="destructive"
						onClick={() => setDeleteDialogOpen(true)}
					>
						<Trash2Icon className="mr-2 h-4 w-4" />
						{t('features.plantSpecies.detail.actions.delete')}
					</Button>
				</div>
			</div>

			{/* Detail Card */}
			<PlantSpeciesDetailCard
				plantSpecies={plantSpecies}
				onEdit={() => setUpdateDialogOpen(true)}
				onDelete={() => setDeleteDialogOpen(true)}
			/>

			{/* Update Form */}
			<PlantSpeciesUpdateForm
				plantSpecies={plantSpecies}
				open={updateDialogOpen}
				onOpenChange={setUpdateDialogOpen}
				onSubmit={handleUpdateSubmit}
				isLoading={isUpdating}
				error={null}
			/>

			{/* Delete Modal */}
			<PlantSpeciesDeleteModal
				plantSpecies={plantSpecies}
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				onConfirm={handleDeleteConfirm}
				isLoading={isDeleting}
			/>
		</div>
	);
}
