'use client';

import type { GrowingUnitResponse } from 'features/growing-units/api/types';
import type { PlantGrowingUnitReference } from 'features/plants/api/types';
import { useMemo, useState } from 'react';
import { z } from 'zod';

const createPlantTransplantSchema = (translations: (key: string) => string) =>
	z.object({
		targetGrowingUnitId: z.string().min(1, {
			message: translations(
				'pages.plants.detail.modals.transplant.fields.targetGrowingUnitId.required',
			),
		}),
	});

export type PlantTransplantFormValues = z.infer<
	ReturnType<typeof createPlantTransplantSchema>
>;

interface UsePlantTransplantFormProps {
	sourceGrowingUnit: PlantGrowingUnitReference | null;
	targetGrowingUnits: GrowingUnitResponse[];
	onSubmit: (targetGrowingUnitId: string) => Promise<void>;
	onOpenChange: (open: boolean) => void;
	error: Error | null;
	translations: (key: string) => string;
}

interface UsePlantTransplantFormReturn {
	// Form state
	targetGrowingUnitId: string;
	formErrors: Record<string, { message?: string }>;
	availableTargetGrowingUnits: GrowingUnitResponse[];

	// State setters
	setTargetGrowingUnitId: (value: string) => void;

	// Event handlers
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
	handleOpenChange: (newOpen: boolean) => void;
}

/**
 * Custom hook for managing PlantTransplantForm state and logic
 * Encapsulates form state management, validation, filtering, and event handling
 */
export function usePlantTransplantForm({
	sourceGrowingUnit,
	targetGrowingUnits,
	onSubmit,
	onOpenChange,
	error,
	translations,
}: UsePlantTransplantFormProps): UsePlantTransplantFormReturn {
	// Create schema with translations
	const transplantSchema = useMemo(
		() => createPlantTransplantSchema(translations),
		[translations],
	);

	// Form state
	const [targetGrowingUnitId, setTargetGrowingUnitId] = useState('');
	const [formErrors, setFormErrors] = useState<
		Record<string, { message?: string }>
	>({});

	// Filter out the source growing unit from target options
	const availableTargetGrowingUnits = useMemo(() => {
		if (!sourceGrowingUnit) return targetGrowingUnits;
		return targetGrowingUnits.filter((gu) => gu.id !== sourceGrowingUnit.id);
	}, [targetGrowingUnits, sourceGrowingUnit]);

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Validate form
		const result = transplantSchema.safeParse({
			targetGrowingUnitId,
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
		await onSubmit(targetGrowingUnitId);
		if (!error) {
			setTargetGrowingUnitId('');
			onOpenChange(false);
		}
	};

	// Handle dialog open/close
	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			setTargetGrowingUnitId('');
			setFormErrors({});
		}
		onOpenChange(newOpen);
	};

	return {
		// Form state
		targetGrowingUnitId,
		formErrors,
		availableTargetGrowingUnits,

		// State setters
		setTargetGrowingUnitId,

		// Event handlers
		handleSubmit,
		handleOpenChange,
	};
}
