'use client';

import type { PlantSpeciesUpdateInput } from '@/features/plant-species/api/types/plant-species-request.types';
import { usePlantSpeciesDelete } from '@/features/plant-species/hooks/use-plant-species-delete/use-plant-species-delete';
import { usePlantSpeciesFindById } from '@/features/plant-species/hooks/use-plant-species-find-by-id/use-plant-species-find-by-id';
import { usePlantSpeciesUpdate } from '@/features/plant-species/hooks/use-plant-species-update/use-plant-species-update';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

/**
 * Hook that provides all the logic for the plant species detail page
 * Centralizes state management, data fetching, and event handlers
 */
export function usePlantSpeciesDetailPage(id: string) {
	const router = useRouter();
	const { plantSpecies, isLoading, error } = usePlantSpeciesFindById(id);

	const {
		handleUpdate,
		isLoading: isUpdating,
	} = usePlantSpeciesUpdate();

	const {
		handleDelete,
		isLoading: isDeleting,
	} = usePlantSpeciesDelete();

	const [activeTab, setActiveTab] = useState<'overview' | 'care' | 'growth'>(
		'overview',
	);

	const handleUpdateSpecies = useCallback(
		async (data: PlantSpeciesUpdateInput) => {
			await handleUpdate(
				{ id, ...data },
				() => {
					toast.success('Species updated successfully');
				},
				() => {
					toast.error('Failed to update species');
				},
			);
		},
		[id, handleUpdate],
	);

	const handleDeleteSpecies = useCallback(async () => {
		await handleDelete(
			id,
			() => {
				toast.success('Species deleted successfully');
				router.push('/plant-species');
			},
			() => {
				toast.error('Failed to delete species');
			},
		);
	}, [id, handleDelete, router]);

	return {
		plantSpecies,
		isLoading,
		error,
		activeTab,
		setActiveTab,
		handleUpdate: handleUpdateSpecies,
		handleDelete: handleDeleteSpecies,
		isUpdating,
		isDeleting,
	};
}
