'use client';

import type { PlantSpeciesCreateFormValues } from '@/features/plant-species/schemas/plant-species-create.schema';
import { PlantSpeciesCreateForm } from '../../forms/PlantSpeciesCreateForm/PlantSpeciesCreateForm';

interface PlantSpeciesCreateModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (values: PlantSpeciesCreateFormValues) => Promise<void>;
	isLoading: boolean;
	error: Error | null;
}

export function PlantSpeciesCreateModal({
	open,
	onOpenChange,
	onSubmit,
	isLoading,
	error,
}: PlantSpeciesCreateModalProps) {
	return (
		<PlantSpeciesCreateForm
			open={open}
			onOpenChange={onOpenChange}
			onSubmit={onSubmit}
			isLoading={isLoading}
			error={error}
		/>
	);
}
