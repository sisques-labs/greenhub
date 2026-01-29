"use client";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/presentation/components/ui/card";
import {
	AlertTriangleIcon,
	FlowerIcon,
	Grid3x3Icon,
	TractorIcon,
	TrendingDownIcon,
	TrendingUpIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface DashboardStatsCardsProps {
	totalPlants: number;
	activeUnits: number;
	readyForHarvest: number;
	criticalAlerts: number;
	isLoading?: boolean;
}

/**
 * Dashboard statistics cards component
 * Displays key metrics: Total Plants, Active Units, Ready for Harvest, Critical Alerts
 */
export function DashboardStatsCards({
	totalPlants,
	activeUnits,
	readyForHarvest,
	criticalAlerts,
	isLoading = false,
}: DashboardStatsCardsProps) {
	const t = useTranslations("dashboard.stats");

	if (isLoading) {
		return (
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{[1, 2, 3, 4].map((i) => (
					<Card key={i} className="animate-pulse">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								<div className="h-4 w-24 bg-muted rounded" />
							</CardTitle>
							<div className="h-4 w-4 bg-muted rounded" />
						</CardHeader>
						<CardContent>
							<div className="h-8 w-20 bg-muted rounded mb-1" />
							<div className="h-3 w-16 bg-muted rounded" />
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	const stats = [
		{
			title: t("totalPlants.title"),
			value: totalPlants.toLocaleString(),
			change: "+12%",
			changeType: "increase" as const,
			icon: FlowerIcon,
			iconColor: "text-green-600",
		},
		{
			title: t("activeUnits.title"),
			value: activeUnits.toString(),
			change: "+2%",
			changeType: "increase" as const,
			icon: Grid3x3Icon,
			iconColor: "text-blue-600",
		},
		{
			title: t("readyForHarvest.title"),
			value: readyForHarvest.toString(),
			change: "+5%",
			changeType: "increase" as const,
			icon: TractorIcon,
			iconColor: "text-orange-600",
		},
		{
			title: t("criticalAlerts.title"),
			value: criticalAlerts.toString(),
			change: "-1%",
			changeType: "decrease" as const,
			icon: AlertTriangleIcon,
			iconColor: "text-red-600",
		},
	];

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{stats.map((stat) => {
				const Icon = stat.icon;
				const TrendIcon =
					stat.changeType === "increase" ? TrendingUpIcon : TrendingDownIcon;
				const trendColor =
					stat.changeType === "increase" ? "text-green-600" : "text-red-600";

				return (
					<Card key={stat.title}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								{stat.title}
							</CardTitle>
							<Icon className={`h-4 w-4 ${stat.iconColor}`} />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stat.value}</div>
							<p className="text-xs text-muted-foreground flex items-center gap-1">
								<TrendIcon className={`h-3 w-3 ${trendColor}`} />
								<span className={trendColor}>{stat.change}</span>
								<span className="text-muted-foreground">
									{t("changeSuffix")}
								</span>
							</p>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
