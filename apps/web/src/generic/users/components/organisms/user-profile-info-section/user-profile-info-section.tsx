'use client';

import type { AuthUserProfileResponse } from '@repo/sdk';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@repo/shared/presentation/components/ui/card';
import { Separator } from '@repo/shared/presentation/components/ui/separator';
import { useTranslations } from 'next-intl';

interface UserProfileInfoSectionProps {
	profile: AuthUserProfileResponse;
}

interface InfoItemProps {
	label: string;
	value: string | null | undefined;
}

function InfoItem({ label, value }: InfoItemProps) {
	if (!value) return null;

	return (
		<div className="space-y-1">
			<p className="text-sm font-medium text-muted-foreground">{label}</p>
			<p className="text-sm">{value}</p>
		</div>
	);
}

export function UserProfileInfoSection({
	profile,
}: UserProfileInfoSectionProps) {
	const t = useTranslations();

	const hasPersonalInfo = profile.name || profile.lastName || profile.userName;

	if (!hasPersonalInfo) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t('user.profile.sections.personalInfo')}</CardTitle>
				<CardDescription>
					{t('user.profile.sections.personalInfoDescription')}
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<InfoItem label={t('user.fields.name.label')} value={profile.name} />
				{profile.name && profile.lastName && <Separator />}
				<InfoItem
					label={t('user.fields.lastName.label')}
					value={profile.lastName}
				/>
				{(profile.name || profile.lastName) && profile.userName && (
					<Separator />
				)}
				<InfoItem
					label={t('user.fields.userName.label')}
					value={profile.userName}
				/>
			</CardContent>
		</Card>
	);
}
