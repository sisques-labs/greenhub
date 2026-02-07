'use client';

import type { UserResponse } from '@/features/users/api/types';
import {
	createUserUpdateSchema,
	UserUpdateFormValues,
} from '@/features/users/schemas/user-update/user-update.schema';
import { useEffect, useMemo, useState } from 'react';

interface UseUserUpdateFormProps {
	user: UserResponse;
	onSubmit: (values: UserUpdateFormValues) => Promise<void>;
	isLoading: boolean;
	error: Error | null;
	t: (key: string) => string;
}

interface UseUserUpdateFormReturn {
	// Form state
	id: string;
	name: string;
	lastName: string;
	userName: string;
	bio: string;
	avatarUrl: string;
	formErrors: Record<string, { message?: string }>;

	// Form handlers
	setName: (value: string) => void;
	setLastName: (value: string) => void;
	setUserName: (value: string) => void;
	setBio: (value: string) => void;
	setAvatarUrl: (value: string) => void;
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;

	// Form metadata
	isDirty: boolean;
	isSubmitting: boolean;
	updateSchema: ReturnType<typeof createUserUpdateSchema>;
}

/**
 * Custom hook for managing UserUpdateForm state and logic
 * Encapsulates form state, dirty tracking, validation, and submission
 */
export function useUserUpdateForm({
	user,
	onSubmit,
	isLoading,
	error,
	t,
}: UseUserUpdateFormProps): UseUserUpdateFormReturn {
	// Create schema with translations
	const updateSchema = useMemo(
		() => createUserUpdateSchema((key: string) => t(key)),
		[t],
	);

	// Form state
	const [id, setId] = useState(user.userId);
	const [name, setName] = useState(user.name || '');
	const [lastName, setLastName] = useState(user.lastName || '');
	const [userName, setUserName] = useState(user.userName || '');
	const [bio, setBio] = useState(user.bio || '');
	const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
	const [formErrors, setFormErrors] = useState<
		Record<string, { message?: string }>
	>({});

	// Initial values for dirty check
	const [initialValues, setInitialValues] = useState({
		name: user.name || '',
		lastName: user.lastName || '',
		userName: user.userName || '',
		bio: user.bio || '',
		avatarUrl: user.avatarUrl || '',
	});

	// Update form when user changes
	useEffect(() => {
		setId(user.userId);
		setName(user.name || '');
		setLastName(user.lastName || '');
		setUserName(user.userName || '');
		setBio(user.bio || '');
		setAvatarUrl(user.avatarUrl || '');
		setInitialValues({
			name: user.name || '',
			lastName: user.lastName || '',
			userName: user.userName || '',
			bio: user.bio || '',
			avatarUrl: user.avatarUrl || '',
		});
		setFormErrors({});
	}, [user]);

	// Check if form has been modified
	const isDirty =
		name !== initialValues.name ||
		lastName !== initialValues.lastName ||
		userName !== initialValues.userName ||
		bio !== initialValues.bio ||
		avatarUrl !== initialValues.avatarUrl;

	const isSubmitting = isLoading;

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Validate form
		const result = updateSchema.safeParse({
			id,
			name: name || undefined,
			lastName: lastName || undefined,
			userName: userName || undefined,
			bio: bio || undefined,
			avatarUrl: avatarUrl || undefined,
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
			// Update initial values after successful submit
			setInitialValues({
				name,
				lastName,
				userName,
				bio,
				avatarUrl,
			});
		}
	};

	return {
		// Form state
		id,
		name,
		lastName,
		userName,
		bio,
		avatarUrl,
		formErrors,

		// Form handlers
		setName,
		setLastName,
		setUserName,
		setBio,
		setAvatarUrl,
		handleSubmit,

		// Form metadata
		isDirty,
		isSubmitting,
		updateSchema,
	};
}
