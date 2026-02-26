'use client';

import type { PlantSpeciesResponse } from '@/features/plant-species/api/types/plant-species-response.types';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { useTranslations } from 'next-intl';

interface PlantSpeciesDeleteModalProps {
	plantSpecies: PlantSpeciesResponse | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => Promise<void>;
	isLoading: boolean;
}

export function PlantSpeciesDeleteModal({
	plantSpecies,
	open,
	onOpenChange,
	onConfirm,
	isLoading,
}: PlantSpeciesDeleteModalProps) {
	const t = useTranslations();

	if (!plantSpecies) {
		return null;
	}

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{t('features.plantSpecies.list.actions.delete.confirm.title')}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{t(
							'features.plantSpecies.list.actions.delete.confirm.description',
							{ name: plantSpecies.commonName },
						)}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isLoading}>
						{t('common.cancel')}
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						disabled={isLoading}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						{isLoading
							? t('features.plantSpecies.list.actions.delete.loading')
							: t('common.delete')}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
