'use client';

import type { AuthUserProfileResponse } from '@repo/sdk';
import { Badge } from '@repo/shared/presentation/components/ui/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@repo/shared/presentation/components/ui/card';
import { Separator } from '@repo/shared/presentation/components/ui/separator';
import { CheckCircle2, Mail, Shield, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface UserProfileAuthSectionProps {
	profile: AuthUserProfileResponse;
}

export function UserProfileAuthSection({
	profile,
}: UserProfileAuthSectionProps) {
	const t = useTranslations();

	const hasAuthInfo =
		profile.email ||
		profile.provider ||
		profile.twoFactorEnabled !== null ||
		profile.emailVerified !== null;

	if (!hasAuthInfo) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Shield className="size-5" />
					{t('user.profile.sections.authInfo')}
				</CardTitle>
				<CardDescription>
					{t('user.profile.sections.authInfoDescription')}
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{profile.email && (
					<div className="space-y-1">
						<div className="flex items-center gap-2">
							<Mail className="size-4 text-muted-foreground" />
							<p className="text-sm font-medium text-muted-foreground">
								{t('user.profile.email')}
							</p>
						</div>
						<div className="flex items-center gap-2">
							<p className="text-sm">{profile.email}</p>
							{profile.emailVerified !== null && (
								<Badge
									variant={profile.emailVerified ? 'default' : 'outline'}
									className="gap-1"
								>
									{profile.emailVerified ? (
										<>
											<CheckCircle2 className="size-3" />
											{t('user.profile.verified')}
										</>
									) : (
										<>
											<XCircle className="size-3" />
											{t('user.profile.unverified')}
										</>
									)}
								</Badge>
							)}
						</div>
					</div>
				)}

				{profile.email && profile.provider && <Separator />}

				{profile.provider && (
					<div className="space-y-1">
						<p className="text-sm font-medium text-muted-foreground">
							{t('user.profile.provider')}
						</p>
						<Badge variant="secondary">{profile.provider}</Badge>
					</div>
				)}

				{(profile.email || profile.provider) &&
					profile.twoFactorEnabled !== null && <Separator />}

				{profile.twoFactorEnabled !== null && (
					<div className="space-y-1">
						<p className="text-sm font-medium text-muted-foreground">
							{t('user.profile.twoFactor')}
						</p>
						<Badge
							variant={profile.twoFactorEnabled ? 'default' : 'outline'}
							className="gap-1"
						>
							{profile.twoFactorEnabled ? (
								<>
									<CheckCircle2 className="size-3" />
									{t('user.profile.enabled')}
								</>
							) : (
								<>
									<XCircle className="size-3" />
									{t('user.profile.disabled')}
								</>
							)}
						</Badge>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
