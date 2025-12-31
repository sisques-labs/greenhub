"use client";

import type { AuthUserProfileResponse } from "@repo/sdk";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/shared/presentation/components/ui/card";
import { Phone } from "lucide-react";
import { useTranslations } from "next-intl";

interface UserProfileContactSectionProps {
	profile: AuthUserProfileResponse;
}

export function UserProfileContactSection({
	profile,
}: UserProfileContactSectionProps) {
	const t = useTranslations();

	if (!profile.phoneNumber) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Phone className="size-5" />
					{t("pages.user.profile.sections.contactInfo.title")}
				</CardTitle>
				<CardDescription>
					{t("pages.user.profile.sections.contactInfo.description")}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-1">
					<p className="text-sm font-medium text-muted-foreground">
						{t("pages.user.profile.fields.phoneNumber")}
					</p>
					<p className="text-sm">{profile.phoneNumber}</p>
				</div>
			</CardContent>
		</Card>
	);
}
