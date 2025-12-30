'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { UserResponse } from '@repo/sdk';
import { Button } from '@repo/shared/presentation/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@repo/shared/presentation/components/ui/form';
import { Input } from '@repo/shared/presentation/components/ui/input';
import { Textarea } from '@repo/shared/presentation/components/ui/textarea';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
	createUserUpdateSchema,
	UserUpdateFormValues,
} from '@/generic/users/dtos/schemas/user-update/user-update.schema';

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

	// Form - initialized with user values
	const form = useForm<UserUpdateFormValues>({
		resolver: zodResolver(updateSchema),
		defaultValues: {
			id: user.id,
			name: user.name || '',
			lastName: user.lastName || '',
			userName: user.userName || '',
			bio: user.bio || '',
			avatarUrl: user.avatarUrl || '',
		},
	});

	// Check if form has been modified
	const isDirty = form.formState.isDirty;
	const isSubmitting = isLoading;

	return (
		// biome-ignore lint/suspicious/noExplicitAny: react-hook-form FormField requires any for generic control
		<Form {...(form as any)}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					// biome-ignore lint/suspicious/noExplicitAny: react-hook-form FormField requires any for generic control
					control={form.control as any}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('user.fields.name.label')}</FormLabel>
							<FormControl>
								<Input
									placeholder={t('user.fields.name.placeholder')}
									disabled={isLoading}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					// biome-ignore lint/suspicious/noExplicitAny: react-hook-form FormField requires any for generic control
					control={form.control as any}
					name="lastName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('user.fields.lastName.label')}</FormLabel>
							<FormControl>
								<Input
									placeholder={t('user.fields.lastName.placeholder')}
									disabled={isLoading}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					// biome-ignore lint/suspicious/noExplicitAny: react-hook-form FormField requires any for generic control
					control={form.control as any}
					name="userName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('user.fields.userName.label')}</FormLabel>
							<FormControl>
								<Input
									placeholder={t('user.fields.userName.placeholder')}
									disabled={isLoading}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					// biome-ignore lint/suspicious/noExplicitAny: react-hook-form FormField requires any for generic control
					control={form.control as any}
					name="bio"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('user.fields.bio.label')}</FormLabel>
							<FormControl>
								<Textarea
									placeholder={t('user.fields.bio.placeholder')}
									disabled={isLoading}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					// biome-ignore lint/suspicious/noExplicitAny: react-hook-form FormField requires any for generic control
					control={form.control as any}
					name="avatarUrl"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('user.fields.avatarUrl.label')}</FormLabel>
							<FormControl>
								<Input
									type="url"
									placeholder={t('user.fields.avatarUrl.placeholder')}
									disabled={isLoading}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{error && (
					<div className="text-sm text-destructive">{error.message}</div>
				)}

				<div className="flex justify-end pt-2">
					<Button type="submit" disabled={!isDirty || isSubmitting}>
						{isSubmitting
							? t('user.actions.update.loading')
							: t('user.actions.update.label')}
					</Button>
				</div>
			</form>
		</Form>
	);
}
