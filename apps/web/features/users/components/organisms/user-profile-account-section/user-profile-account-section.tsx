'use client';

import type { AuthUserProfileResponse } from '@/features/auth/api/types';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import { Calendar, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface UserProfileAccountSectionProps {
	profile: AuthUserProfileResponse;
}

function formatDate(date: Date | null | undefined): string {
	if (!date) return '-';
	return new Date(date).toLocaleDateString('es-ES', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
}

export function UserProfileAccountSection({
	profile,
}: UserProfileAccountSectionProps) {
	const t = useTranslations();

	const hasAccountInfo =
		profile.role || profile.status || profile.createdAt || profile.lastLoginAt;

	if (!hasAccountInfo) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Calendar className="size-5" />
					{t('features.users.profile.sections.accountInfo.title')}
				</CardTitle>
				<CardDescription>
					{t('features.users.profile.sections.accountInfo.description')}
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{profile.role && (
					<div className="space-y-1">
						<p className="text-sm font-medium text-muted-foreground">
							{t('features.users.profile.fields.role.label')}
						</p>
						<p className="text-sm">{profile.role}</p>
					</div>
				)}

				{profile.role && profile.status && <Separator />}

				{profile.status && (
					<div className="space-y-1">
						<p className="text-sm font-medium text-muted-foreground">
							{t('features.users.profile.fields.status.label')}
						</p>
						<p className="text-sm">{profile.status}</p>
					</div>
				)}

				{(profile.role || profile.status) && profile.createdAt && <Separator />}

				{profile.createdAt && (
					<div className="space-y-1">
						<div className="flex items-center gap-2">
							<Calendar className="size-4 text-muted-foreground" />
							<p className="text-sm font-medium text-muted-foreground">
								{t('features.users.profile.fields.createdAt')}
							</p>
						</div>
						<p className="text-sm">{formatDate(profile.createdAt)}</p>
					</div>
				)}

				{profile.createdAt && profile.lastLoginAt && <Separator />}

				{profile.lastLoginAt && (
					<div className="space-y-1">
						<div className="flex items-center gap-2">
							<Clock className="size-4 text-muted-foreground" />
							<p className="text-sm font-medium text-muted-foreground">
								{t('features.users.profile.fields.lastLoginAt')}
							</p>
						</div>
						<p className="text-sm">{formatDate(profile.lastLoginAt)}</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
