'use client';

import {
	createLocationCreateSchema,
	LocationCreateFormValues,
} from 'features/locations/schemas/location-create/location-create.schema';
import { useMemo, useState } from 'react';

interface UseLocationCreateFormProps {
	onSubmit: (values: LocationCreateFormValues) => Promise<void>;
	onOpenChange: (open: boolean) => void;
	error: Error | null;
	translations: (key: string) => string;
}

interface UseLocationCreateFormReturn {
	// Form state
	name: string;
	type: LocationCreateFormValues['type'];
	description: string | null;
	formErrors: Record<string, { message?: string }>;

	// State setters
	setName: (value: string) => void;
	setType: (value: LocationCreateFormValues['type']) => void;
	setDescription: (value: string | null) => void;

	// Event handlers
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
	handleOpenChange: (newOpen: boolean) => void;
}

/**
 * Custom hook for managing LocationCreateForm state and logic
 * Encapsulates form state management, validation, and event handling
 */
export function useLocationCreateForm({
	onSubmit,
	onOpenChange,
	error,
	translations,
}: UseLocationCreateFormProps): UseLocationCreateFormReturn {
	// Create schema with translations
	const createSchema = useMemo(
		() => createLocationCreateSchema(translations),
		[translations],
	);

	// Form state
	const [name, setName] = useState('');
	const [type, setType] =
		useState<LocationCreateFormValues['type']>('INDOOR_SPACE');
	const [description, setDescription] = useState<string | null>(null);
	const [formErrors, setFormErrors] = useState<
		Record<string, { message?: string }>
	>({});

	// Reset form to initial state
	const resetForm = () => {
		setName('');
		setType('INDOOR_SPACE');
		setDescription(null);
		setFormErrors({});
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Validate form
		const result = createSchema.safeParse({
			name,
			type,
			description,
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
		name,
		type,
		description,
		formErrors,

		// State setters
		setName,
		setType,
		setDescription,

		// Event handlers
		handleSubmit,
		handleOpenChange,
	};
}
