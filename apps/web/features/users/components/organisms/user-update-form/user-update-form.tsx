'use client';

import type { UserResponse } from '@/features/users/api/types';
import { Button } from '@/shared/components/ui/button';
import {
	Form,
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { UserUpdateFormValues } from 'features/users/schemas/user-update/user-update.schema';
import { useTranslations } from 'next-intl';
import { useUserUpdateForm } from '../../hooks/use-user-update-form/use-user-update-form';

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

	const {
		name,
		lastName,
		userName,
		bio,
		avatarUrl,
		formErrors,
		setName,
		setLastName,
		setUserName,
		setBio,
		setAvatarUrl,
		handleSubmit,
		isDirty,
		isSubmitting,
	} = useUserUpdateForm({
		user,
		onSubmit,
		isLoading,
		error,
		t,
	});

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
