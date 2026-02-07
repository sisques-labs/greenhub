'use client';

import {
	UserResponse,
	transformAuthProfileToUser,
} from '@/features/users/api/types';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/card';
import { useAuthProfileMe } from 'features/auth/hooks/use-auth-profile-me/use-auth-profile-me';
import { UserProfileAccountSection } from 'features/users/components/organisms/user-profile-account-section/user-profile-account-section';
import { UserProfileAuthSection } from 'features/users/components/organisms/user-profile-auth-section/user-profile-auth-section';
import { UserProfileContactSection } from 'features/users/components/organisms/user-profile-contact-section/user-profile-contact-section';
import { UserProfileHeader } from 'features/users/components/organisms/user-profile-header/user-profile-header';
import { UserProfileInfoSection } from 'features/users/components/organisms/user-profile-info-section/user-profile-info-section';
import { UserProfilePageSkeleton } from 'features/users/components/organisms/user-profile-page-skeleton/user-profile-page-skeleton';
import { UserUpdateForm } from 'features/users/components/organisms/user-update-form/user-update-form';
import { useUserUpdate } from 'features/users/hooks/use-user-update/use-user-update';
import type { UserUpdateFormValues } from 'features/users/schemas/user-update/user-update.schema';
import { useTranslations } from 'next-intl';

export function UserProfilePage() {
	const t = useTranslations();

	const {
		profile,
		isLoading: isLoadingProfile,
		error: profileError,
		refetch,
	} = useAuthProfileMe();
	const {
		handleUpdate,
		isLoading: isUpdating,
		error: updateError,
	} = useUserUpdate();

	const handleSubmit = async (values: UserUpdateFormValues) => {
		await handleUpdate(values, () => {
			// Refetch user profile data after successful update
			refetch();
		});
	};

	// Show skeleton while loading or if data is not yet available
	if (isLoadingProfile || profile === null || profile === undefined) {
		return <UserProfilePageSkeleton />;
	}

	if (profileError) {
		return (
			<div className="mx-auto py-8">
				<div className="flex items-center justify-center min-h-[400px]">
					<p className="text-destructive">
						{t('pages.user.profile.error.loading', {
							message: profileError.message,
						})}
					</p>
				</div>
			</div>
		);
	}

	if (!profile) {
		return (
			<div className="mx-auto py-8">
				<div className="flex items-center justify-center min-h-[400px]">
					<p className="text-muted-foreground">{t('common.notFound')}</p>
				</div>
			</div>
		);
	}

	// Convert AuthUserProfileResponse to UserResponse format for the form
	const user: UserResponse = transformAuthProfileToUser(profile);

	return (
		<div className="mx-auto space-y-6">
			{/* Header with Avatar and Basic Info */}
			<UserProfileHeader profile={profile} />

			{/* Grid Layout for Sections */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Personal Information */}
				<UserProfileInfoSection profile={profile} />

				{/* Authentication Information */}
				<UserProfileAuthSection profile={profile} />

				{/* Account Information */}
				<UserProfileAccountSection profile={profile} />

				{/* Contact Information */}
				<UserProfileContactSection profile={profile} />

				{/* Edit Form Section */}
				<Card>
					<CardHeader>
						<CardTitle>
							{t('pages.user.profile.sections.editProfile.title')}
						</CardTitle>
						<CardDescription>
							{t('pages.user.profile.sections.editProfile.description')}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<UserUpdateForm
							user={user}
							onSubmit={handleSubmit}
							isLoading={isUpdating}
							error={updateError}
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
