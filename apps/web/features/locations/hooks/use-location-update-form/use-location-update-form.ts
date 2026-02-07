import { useEffect, useMemo, useState } from 'react';
import type { LocationResponse } from '../../api/types';
import {
	createLocationUpdateSchema,
	type LocationUpdateFormValues,
} from '../../schemas/location-update/location-update.schema';

interface UseLocationUpdateFormParams {
	location: LocationResponse | null;
	onSubmit: (values: LocationUpdateFormValues) => Promise<void>;
	error: Error | null;
	onOpenChange: (open: boolean) => void;
	t: (key: string) => string;
}

/**
 * Custom hook to manage LocationUpdateForm state and logic
 * Handles synchronization, validation, and form state management
 */
export function useLocationUpdateForm({
	location,
	onSubmit,
	error,
	onOpenChange,
	t,
}: UseLocationUpdateFormParams) {
	// Create schema with translations
	const updateSchema = useMemo(
		() => createLocationUpdateSchema(t),
		[t],
	);

	// Form state
	const [name, setName] = useState('');
	const [type, setType] = useState<LocationUpdateFormValues['type']>('INDOOR_SPACE');
	const [description, setDescription] = useState<string | null>(null);
	const [formErrors, setFormErrors] = useState<Record<string, { message?: string }>>({});

	// Update form when location changes
	useEffect(() => {
		if (location) {
			setName(location.name);
			setType(location.type as LocationUpdateFormValues['type']);
			setDescription(location.description || null);
			setFormErrors({});
		}
	}, [location]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!location) return;

		// Validate form
		const result = updateSchema.safeParse({
			id: location.id,
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
			onOpenChange(false);
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			// Reset form
			if (location) {
				setName(location.name);
				setType(location.type as LocationUpdateFormValues['type']);
				setDescription(location.description || null);
			}
			setFormErrors({});
		}
		onOpenChange(newOpen);
	};

	return {
		// Form state
		name,
		setName,
		type,
		setType,
		description,
		setDescription,
		formErrors,
		// Handlers
		handleSubmit,
		handleOpenChange,
	};
}
