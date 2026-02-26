'use client';

import { PlantSpeciesDetailCard } from '@/features/plant-species/components/cards/PlantSpeciesDetailCard/PlantSpeciesDetailCard';
import { PlantSpeciesDeleteModal } from '@/features/plant-species/components/modals/PlantSpeciesDeleteModal/PlantSpeciesDeleteModal';
import { PlantSpeciesUpdateForm } from '@/features/plant-species/components/forms/PlantSpeciesUpdateForm/PlantSpeciesUpdateForm';
import { usePlantSpeciesDetailPage } from '@/features/plant-species/hooks/pages/usePlantSpeciesDetailPage';
import type { PlantSpeciesUpdateFormValues } from '@/features/plant-species/schemas/plant-species-update.schema';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { ChevronRightIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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
		updateDialogOpen,
		setUpdateDialogOpen,
		deleteDialogOpen,
		setDeleteDialogOpen,
	} = usePlantSpeciesDetailPage(id);

	if (isLoading || plantSpecies === undefined) {
		return (
			<div className="mx-auto space-y-6">
				<div className="flex items-center gap-2">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-4 w-4" />
					<Skeleton className="h-4 w-32" />
				</div>
				<Skeleton className="h-96 w-full" />
			</div>
		);
	}

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

			<PlantSpeciesDetailCard
				plantSpecies={plantSpecies}
				onEdit={() => setUpdateDialogOpen(true)}
				onDelete={() => setDeleteDialogOpen(true)}
			/>

			<PlantSpeciesUpdateForm
				plantSpecies={plantSpecies}
				open={updateDialogOpen}
				onOpenChange={setUpdateDialogOpen}
				onSubmit={(values: PlantSpeciesUpdateFormValues) =>
					handleUpdate(values as Parameters<typeof handleUpdate>[0])
				}
				isLoading={isUpdating}
				error={null}
			/>

			<PlantSpeciesDeleteModal
				plantSpecies={plantSpecies}
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				onConfirm={handleDelete}
				isLoading={isDeleting}
			/>
		</div>
	);
}
