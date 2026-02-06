'use client';

import { PLANT_STATUS } from '@/features/plants/constants/plant-status';
import {
	createPlantCreateSchema,
	PlantCreateFormValues,
} from 'features/plants/schemas/plant-create/plant-create.schema';
import { useMemo, useState } from 'react';

interface UsePlantCreateFormProps {
	initialGrowingUnitId?: string;
	onSubmit: (values: PlantCreateFormValues) => Promise<void>;
	onOpenChange: (open: boolean) => void;
	error: Error | null;
	translations: (key: string) => string;
}

interface UsePlantCreateFormReturn {
	// Form state
	selectedGrowingUnitId: string;
	name: string;
	species: string;
	plantedDate: Date;
	notes: string;
	status: PlantCreateFormValues['status'];
	formErrors: Record<string, { message?: string }>;

	// State setters
	setSelectedGrowingUnitId: (value: string) => void;
	setName: (value: string) => void;
	setSpecies: (value: string) => void;
	setPlantedDate: (value: Date) => void;
	setNotes: (value: string) => void;
	setStatus: (value: PlantCreateFormValues['status']) => void;

	// Event handlers
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
	handleOpenChange: (newOpen: boolean) => void;
}

/**
 * Custom hook for managing PlantCreateForm state and logic
 * Encapsulates form state management, validation, and event handling
 */
export function usePlantCreateForm({
	initialGrowingUnitId,
	onSubmit,
	onOpenChange,
	error,
	translations,
}: UsePlantCreateFormProps): UsePlantCreateFormReturn {
	// Create schema with translations
	const createSchema = useMemo(
		() => createPlantCreateSchema(translations),
		[translations],
	);

	// Form state
	const [selectedGrowingUnitId, setSelectedGrowingUnitId] = useState<string>(
		initialGrowingUnitId || '',
	);
	const [name, setName] = useState('');
	const [species, setSpecies] = useState('');
	const [plantedDate, setPlantedDate] = useState<Date>(new Date());
	const [notes, setNotes] = useState('');
	const [status, setStatus] = useState<PlantCreateFormValues['status']>(
		PLANT_STATUS.PLANTED,
	);
	const [formErrors, setFormErrors] = useState<
		Record<string, { message?: string }>
	>({});

	// Reset form to initial state
	const resetForm = () => {
		setSelectedGrowingUnitId(initialGrowingUnitId || '');
		setName('');
		setSpecies('');
		setPlantedDate(new Date());
		setNotes('');
		setStatus(PLANT_STATUS.PLANTED);
		setFormErrors({});
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Use selected growing unit ID or the provided one
		const finalGrowingUnitId =
			selectedGrowingUnitId || initialGrowingUnitId || '';

		// Validate form
		const result = createSchema.safeParse({
			name,
			species,
			plantedDate,
			notes: notes || undefined,
			status,
			growingUnitId: finalGrowingUnitId,
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
			resetForm();
			onOpenChange(false);
		}
	};

	// Handle dialog open/close
	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			resetForm();
		}
		onOpenChange(newOpen);
	};

	return {
		// Form state
		selectedGrowingUnitId,
		name,
		species,
		plantedDate,
		notes,
		status,
		formErrors,

		// State setters
		setSelectedGrowingUnitId,
		setName,
		setSpecies,
		setPlantedDate,
		setStatus,
		setNotes,

		// Event handlers
		handleSubmit,
		handleOpenChange,
	};
}
