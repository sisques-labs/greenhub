'use client';

import type { AuthUserProfileResponse } from '@/features/auth/api/types';
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@repo/shared/presentation/components/ui/avatar';
import { Badge } from '@repo/shared/presentation/components/ui/badge';
import {
	Card,
	CardContent,
} from '@repo/shared/presentation/components/ui/card';
import { useTranslations } from 'next-intl';

interface UserProfileHeaderProps {
	profile: AuthUserProfileResponse;
}

export function UserProfileHeader({ profile }: UserProfileHeaderProps) {
	const t = useTranslations();

	const fullName =
		[profile.name, profile.lastName].filter(Boolean).join(' ') ||
		profile.userName ||
		t('pages.user.profile.anonymous');

	const initials =
		[profile.name, profile.lastName]
			.filter(Boolean)
			.map((n) => n?.[0])
			.join('')
			.toUpperCase() ||
		profile.userName?.[0]?.toUpperCase() ||
		'?';

	return (
		<Card>
			<CardContent className="pt-6">
				<div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
					<Avatar className="size-24">
						{profile.avatarUrl && (
							<AvatarImage src={profile.avatarUrl} alt={fullName} />
						)}
						<AvatarFallback className="text-2xl">{initials}</AvatarFallback>
					</Avatar>
					<div className="flex-1 space-y-2">
						<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
							<h1 className="text-3xl font-bold">{fullName}</h1>
							{profile.role && (
								<Badge variant="secondary">{profile.role}</Badge>
							)}
							{profile.status && (
								<Badge
									variant={profile.status === 'ACTIVE' ? 'default' : 'outline'}
								>
									{profile.status}
								</Badge>
							)}
						</div>
						{profile.userName && (
							<p className="text-muted-foreground">@{profile.userName}</p>
						)}
						{profile.bio && (
							<p className="text-sm text-muted-foreground mt-2">
								{profile.bio}
							</p>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
