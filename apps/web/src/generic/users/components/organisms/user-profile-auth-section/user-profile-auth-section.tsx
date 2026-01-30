"use client";

import type { AuthUserProfileResponse } from "@repo/sdk";
import { Badge } from "@/ui/primitives/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/ui/primitives/card";
import { Separator } from "@/ui/primitives/separator";
import { CheckCircle2, Mail, Shield, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";

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
					{t("pages.user.profile.sections.authInfo.title")}
				</CardTitle>
				<CardDescription>
					{t("pages.user.profile.sections.authInfo.description")}
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{profile.email && (
					<div className="space-y-1">
						<div className="flex items-center gap-2">
							<Mail className="size-4 text-muted-foreground" />
							<p className="text-sm font-medium text-muted-foreground">
								{t("pages.user.profile.fields.email")}
							</p>
						</div>
						<div className="flex items-center gap-2">
							<p className="text-sm">{profile.email}</p>
							{profile.emailVerified !== null && (
								<Badge
									variant={profile.emailVerified ? "default" : "outline"}
									className="gap-1"
								>
									{profile.emailVerified ? (
										<>
											<CheckCircle2 className="size-3" />
											{t("pages.user.profile.fields.verified")}
										</>
									) : (
										<>
											<XCircle className="size-3" />
											{t("pages.user.profile.fields.unverified")}
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
							{t("pages.user.profile.fields.provider")}
						</p>
						<Badge variant="secondary">{profile.provider}</Badge>
					</div>
				)}

				{(profile.email || profile.provider) &&
					profile.twoFactorEnabled !== null && <Separator />}

				{profile.twoFactorEnabled !== null && (
					<div className="space-y-1">
						<p className="text-sm font-medium text-muted-foreground">
							{t("user.profile.twoFactor")}
						</p>
						<Badge
							variant={profile.twoFactorEnabled ? "default" : "outline"}
							className="gap-1"
						>
							{profile.twoFactorEnabled ? (
								<>
									<CheckCircle2 className="size-3" />
									{t("user.profile.enabled")}
								</>
							) : (
								<>
									<XCircle className="size-3" />
									{t("user.profile.disabled")}
								</>
							)}
						</Badge>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
