'use client';

import type { UserResponse } from '@/features/users/api/types';
import { Button } from '@repo/shared/presentation/components/ui/button';
import {
	Form,
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
} from '@repo/shared/presentation/components/ui/form';
import { Input } from '@repo/shared/presentation/components/ui/input';
import { Textarea } from '@repo/shared/presentation/components/ui/textarea';
import {
	createUserUpdateSchema,
	UserUpdateFormValues,
} from 'features/users/schemas/user-update/user-update.schema';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

interface UserUpdateFormProps {
	user: UserResponse;
	onSubmit: (values: UserUpdateFormValues) => Promise<void>;
	isLoading: boolean;
	error: Error | null;
}

export function UserUpdateForm({
	user,
	onSubmit,
	isLoading,
	error,
}: UserUpdateFormProps) {
	const t = useTranslations();

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

	return (
		<Form errors={formErrors}>
			<form onSubmit={handleSubmit} className="space-y-4">
				<FormItem>
					<FormLabel>{t('pages.user.profile.fields.name.label')}</FormLabel>
					<FormControl>
						<Input
							placeholder={t('pages.user.profile.fields.name.placeholder')}
							disabled={isLoading}
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</FormControl>
					<FormMessage fieldName="name" />
				</FormItem>

				<FormItem>
					<FormLabel>{t('pages.user.profile.fields.lastName.label')}</FormLabel>
					<FormControl>
						<Input
							placeholder={t('pages.user.profile.fields.lastName.placeholder')}
							disabled={isLoading}
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
						/>
					</FormControl>
					<FormMessage fieldName="lastName" />
				</FormItem>

				<FormItem>
					<FormLabel>{t('pages.user.profile.fields.userName.label')}</FormLabel>
					<FormControl>
						<Input
							placeholder={t('pages.user.profile.fields.userName.placeholder')}
							disabled={isLoading}
							value={userName}
							onChange={(e) => setUserName(e.target.value)}
						/>
					</FormControl>
					<FormMessage fieldName="userName" />
				</FormItem>

				<FormItem>
					<FormLabel>{t('pages.user.profile.fields.bio.label')}</FormLabel>
					<FormControl>
						<Textarea
							placeholder={t('pages.user.profile.fields.bio.placeholder')}
							disabled={isLoading}
							value={bio}
							onChange={(e) => setBio(e.target.value)}
						/>
					</FormControl>
					<FormMessage fieldName="bio" />
				</FormItem>

				<FormItem>
					<FormLabel>
						{t('pages.user.profile.fields.avatarUrl.label')}
					</FormLabel>
					<FormControl>
						<Input
							type="url"
							placeholder={t('pages.user.profile.fields.avatarUrl.placeholder')}
							disabled={isLoading}
							value={avatarUrl}
							onChange={(e) => setAvatarUrl(e.target.value)}
						/>
					</FormControl>
					<FormMessage fieldName="avatarUrl" />
				</FormItem>

				{error && (
					<div className="text-sm text-destructive">{error.message}</div>
				)}

				<div className="flex justify-end pt-2">
					<Button type="submit" disabled={!isDirty || isSubmitting}>
						{isSubmitting
							? t('pages.user.profile.actions.update.loading')
							: t('pages.user.profile.actions.update.label')}
					</Button>
				</div>
			</form>
		</Form>
	);
}
