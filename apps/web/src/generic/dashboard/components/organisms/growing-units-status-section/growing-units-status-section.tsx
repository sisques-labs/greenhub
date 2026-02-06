"use client";

import type { GrowingUnitResponse } from "@repo/sdk";
import { Button } from "@repo/shared/presentation/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@repo/shared/presentation/components/ui/card";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { GrowingUnitCard } from "features/growing-units/components/organisms/growing-unit-card/growing-unit-card";
import { useAppRoutes } from "@/shared/hooks/use-routes";

interface GrowingUnitsStatusSectionProps {
	growingUnits: GrowingUnitResponse[];
	isLoading?: boolean;
}

/**
 * Growing units status section component
 * Displays recent growing units with their status and key metrics
 */
export function GrowingUnitsStatusSection({
	growingUnits,
	isLoading = false,
}: GrowingUnitsStatusSectionProps) {
	const t = useTranslations("dashboard.growingUnitsStatus");
	const { routes } = useAppRoutes();

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<div className="h-6 w-48 bg-muted rounded animate-pulse" />
						<div className="h-4 w-20 bg-muted rounded animate-pulse" />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-2">
						{[1, 2].map((i) => (
							<div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
						))}
					</div>
				</CardContent>
			</Card>
		);
	}

	if (growingUnits.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{t("title")}</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground text-center py-8">{t("empty")}</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<span>{t("title")}</span>
					<Button variant="link" asChild className="text-green-600">
						<Link href={routes.growingUnits}>
							{t("seeAll")}
							<ArrowRightIcon className="ml-1 h-4 w-4" />
						</Link>
					</Button>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4 md:grid-cols-2">
					{growingUnits.map((growingUnit) => (
						<GrowingUnitCard key={growingUnit.id} growingUnit={growingUnit} />
					))}
				</div>
			</CardContent>
		</Card>
	);
}
