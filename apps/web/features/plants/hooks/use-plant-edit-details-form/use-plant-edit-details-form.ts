'use client';

import type { PlantResponse } from '@/features/plants/api/types';
import { PLANT_STATUS } from '@/features/plants/constants/plant-status';
import {
	createPlantUpdateSchema,
	PlantUpdateFormValues,
} from '@/features/plants/schemas/plant-update/plant-update.schema';
import { useEffect, useMemo, useState } from 'react';

interface UsePlantEditDetailsFormProps {
	plant: PlantResponse;
	onSubmit: (values: PlantUpdateFormValues) => Promise<void>;
	error: Error | null;
	onOpenChange: (open: boolean) => void;
	translations: (key: string) => string;
}

interface UsePlantEditDetailsFormReturn {
	// Form state
	name: string;
	setName: (value: string) => void;
	species: string;
	setSpecies: (value: string) => void;
	plantedDate: Date | null;
	setPlantedDate: (value: Date | null) => void;
	notes: string;
	setNotes: (value: string) => void;
	status: PlantUpdateFormValues['status'];
	setStatus: (value: PlantUpdateFormValues['status']) => void;
	formErrors: Record<string, { message?: string }>;

	// Handlers
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
	handleOpenChange: (newOpen: boolean) => void;
}

export function usePlantEditDetailsForm({
	plant,
	onSubmit,
	error,
	onOpenChange,
	translations,
}: UsePlantEditDetailsFormProps): UsePlantEditDetailsFormReturn {
	// Create schema with translations
	const updateSchema = useMemo(
		() => createPlantUpdateSchema(translations),
		[translations],
	);

	// Form state - initialize with plant data
	const [name, setName] = useState(plant.name || '');
	const [species, setSpecies] = useState(plant.species || '');
	const [plantedDate, setPlantedDate] = useState<Date | null>(
		plant.plantedDate ? new Date(plant.plantedDate) : null,
	);
	const [notes, setNotes] = useState(plant.notes || '');
	const [status, setStatus] = useState<PlantUpdateFormValues['status']>(
		(plant.status as PlantUpdateFormValues['status']) || PLANT_STATUS.PLANTED,
	);
	const [formErrors, setFormErrors] = useState<
		Record<string, { message?: string }>
	>({});

	// Update form when plant changes
	useEffect(() => {
		if (plant) {
			setName(plant.name || '');
			setSpecies(plant.species || '');
			setPlantedDate(plant.plantedDate ? new Date(plant.plantedDate) : null);
			setNotes(plant.notes || '');
			setStatus(
				(plant.status as PlantUpdateFormValues['status']) ||
					PLANT_STATUS.PLANTED,
			);
		}
	}, [plant]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Validate form
		const result = updateSchema.safeParse({
			name: name || undefined,
			species: species || undefined,
			plantedDate: plantedDate || null,
			notes: notes || null,
			status,
		});

		if (!result.success) {
			const errors: Record<string, { message?: string }> = {};
			result.error.issues.forEach((err) => {
				if (err.path[0]) {
					errors[err.path[0] as string] = { message: err.message };
				}
			});
			setFormErrors(errors);
			return;
		}

		setFormErrors({});
		await onSubmit(result.data);
		if (!error) {
			onOpenChange(false);
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			// Reset form to plant data
			setName(plant.name || '');
			setSpecies(plant.species || '');
			setPlantedDate(plant.plantedDate ? new Date(plant.plantedDate) : null);
			setNotes(plant.notes || '');
			setStatus(
				(plant.status as PlantUpdateFormValues['status']) ||
					PLANT_STATUS.PLANTED,
			);
			setFormErrors({});
		}
		onOpenChange(newOpen);
	};

	return {
		// Form state
		name,
		setName,
		species,
		setSpecies,
		plantedDate,
		setPlantedDate,
		notes,
		setNotes,
		status,
		setStatus,
		formErrors,

		// Handlers
		handleSubmit,
		handleOpenChange,
	};
}
