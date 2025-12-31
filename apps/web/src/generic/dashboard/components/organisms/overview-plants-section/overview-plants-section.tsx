"use client";

import type { OverviewResponse } from "@repo/sdk";
import { Badge } from "@repo/shared/presentation/components/ui/badge";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@repo/shared/presentation/components/ui/card";
import { Progress } from "@repo/shared/presentation/components/ui/progress";
import {
	ArchiveIcon,
	CalendarIcon,
	CheckCircleIcon,
	ClockIcon,
	FileTextIcon,
	FlowerIcon,
	XCircleIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface OverviewPlantsSectionProps {
	overview: OverviewResponse | null;
	isLoading?: boolean;
}

/**
 * Overview plants section component
 * Displays detailed plant metrics and status breakdown
 */
export function OverviewPlantsSection({
	overview,
	isLoading = false,
}: OverviewPlantsSectionProps) {
	const t = useTranslations("dashboard.sections.plants");

	if (isLoading || !overview) {
		return (
			<Card className="animate-pulse">
				<CardHeader>
					<div className="h-6 w-32 bg-muted rounded" />
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="h-20 bg-muted rounded" />
						<div className="h-20 bg-muted rounded" />
					</div>
				</CardContent>
			</Card>
		);
	}

	const totalPlants = overview.totalPlants;
	const activePercentage =
		totalPlants > 0
			? Math.round((overview.totalActivePlants / totalPlants) * 100)
			: 0;

	const statusBreakdown = [
		{
			label: t("planted"),
			value: overview.plantsPlanted,
			color: "bg-blue-500",
			icon: FlowerIcon,
		},
		{
			label: t("growing"),
			value: overview.plantsGrowing,
			color: "bg-green-500",
			icon: FlowerIcon,
		},
		{
			label: t("harvested"),
			value: overview.plantsHarvested,
			color: "bg-orange-500",
			icon: CheckCircleIcon,
		},
		{
			label: t("dead"),
			value: overview.plantsDead,
			color: "bg-red-500",
			icon: XCircleIcon,
		},
		{
			label: t("archived"),
			value: overview.plantsArchived,
			color: "bg-gray-500",
			icon: ArchiveIcon,
		},
	];

	const additionalMetrics = [
		{
			label: t("withoutPlantedDate"),
			value: overview.plantsWithoutPlantedDate,
			icon: CalendarIcon,
			color: "text-yellow-600",
		},
		{
			label: t("withNotes"),
			value: overview.plantsWithNotes,
			icon: FileTextIcon,
			color: "text-blue-600",
		},
		{
			label: t("recent7Days"),
			value: overview.recentPlants,
			icon: ClockIcon,
			color: "text-green-600",
		},
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<FlowerIcon className="h-5 w-5 text-green-600" />
					{t("title")}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Main Stats */}
				<div className="grid gap-4 md:grid-cols-3">
					<div className="space-y-2">
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">{t("totalPlants")}</span>
							<span className="font-semibold">
								{totalPlants.toLocaleString()}
							</span>
						</div>
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">{t("activePlants")}</span>
							<span className="font-semibold text-green-600">
								{overview.totalActivePlants.toLocaleString()}
							</span>
						</div>
						<Progress value={activePercentage} className="h-2" />
						<p className="text-xs text-muted-foreground">
							{t("activePercentage", { percentage: activePercentage })}
						</p>
					</div>

					<div className="space-y-2">
						<div className="text-sm font-medium mb-3">
							{t("statusBreakdown")}
						</div>
						<div className="space-y-2">
							{statusBreakdown.map((status) => {
								const Icon = status.icon;
								const percentage =
									totalPlants > 0
										? Math.round((status.value / totalPlants) * 100)
										: 0;

								return (
									<div key={status.label} className="flex items-center gap-2">
										<Icon className="h-4 w-4 text-muted-foreground" />
										<div className="flex-1">
											<div className="flex items-center justify-between text-xs mb-1">
												<span className="text-muted-foreground">
													{status.label}
												</span>
												<span className="font-medium">
													{status.value} ({percentage}%)
												</span>
											</div>
											<Progress value={percentage} className="h-1.5" />
										</div>
									</div>
								);
							})}
						</div>
					</div>

					<div className="space-y-2">
						<div className="text-sm font-medium mb-3">
							{t("additionalMetrics")}
						</div>
						<div className="space-y-3">
							{additionalMetrics.map((metric) => {
								const Icon = metric.icon;
								return (
									<div
										key={metric.label}
										className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
									>
										<div className="flex items-center gap-2">
											<Icon className={`h-4 w-4 ${metric.color}`} />
											<span className="text-sm text-muted-foreground">
												{metric.label}
											</span>
										</div>
										<Badge variant="secondary" className="font-semibold">
											{metric.value}
										</Badge>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
