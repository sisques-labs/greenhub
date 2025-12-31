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
import { AlertTriangleIcon, CheckCircleIcon, PackageIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface OverviewCapacitySectionProps {
	overview: OverviewResponse | null;
	isLoading?: boolean;
}

/**
 * Overview capacity section component
 * Displays capacity metrics and occupancy information
 */
export function OverviewCapacitySection({
	overview,
	isLoading = false,
}: OverviewCapacitySectionProps) {
	const t = useTranslations("dashboard.sections.capacity");

	if (isLoading || !overview) {
		return (
			<Card className="animate-pulse">
				<CardHeader>
					<div className="h-6 w-32 bg-muted rounded" />
				</CardHeader>
				<CardContent>
					<div className="h-40 bg-muted rounded" />
				</CardContent>
			</Card>
		);
	}

	const occupancyPercentage = overview.averageOccupancy;
	const remainingCapacity = overview.totalRemainingCapacity;
	const usedCapacity = overview.totalCapacityUsed;
	const totalCapacity = overview.totalCapacity;

	const getOccupancyColor = (percentage: number) => {
		if (percentage >= 90) return "text-red-600";
		if (percentage >= 80) return "text-orange-600";
		if (percentage >= 50) return "text-yellow-600";
		return "text-green-600";
	};

	const _getOccupancyBgColor = (percentage: number) => {
		if (percentage >= 90) return "bg-red-500";
		if (percentage >= 80) return "bg-orange-500";
		if (percentage >= 50) return "bg-yellow-500";
		return "bg-green-500";
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<PackageIcon className="h-5 w-5 text-blue-600" />
					{t("title")}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Overall Capacity */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">{t("averageOccupancy")}</span>
						<span
							className={`text-2xl font-bold ${getOccupancyColor(occupancyPercentage)}`}
						>
							{occupancyPercentage.toFixed(1)}%
						</span>
					</div>
					<Progress value={occupancyPercentage} className="h-4" />

					<div className="grid grid-cols-3 gap-4 pt-4">
						<div className="text-center p-3 rounded-lg bg-muted/50">
							<div className="text-2xl font-bold">
								{totalCapacity.toLocaleString()}
							</div>
							<div className="text-xs text-muted-foreground mt-1">
								{t("totalCapacity")}
							</div>
						</div>
						<div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
							<div className="text-2xl font-bold text-blue-600">
								{usedCapacity.toLocaleString()}
							</div>
							<div className="text-xs text-muted-foreground mt-1">
								{t("used")}
							</div>
						</div>
						<div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
							<div className="text-2xl font-bold text-green-600">
								{remainingCapacity.toLocaleString()}
							</div>
							<div className="text-xs text-muted-foreground mt-1">
								{t("available")}
							</div>
						</div>
					</div>
				</div>

				{/* Alerts */}
				<div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
					<div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20">
						<div className="flex items-center gap-2">
							<AlertTriangleIcon className="h-5 w-5 text-orange-600" />
							<span className="text-sm font-medium">{t("atLimit")}</span>
						</div>
						<Badge
							variant="outline"
							className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700"
						>
							{overview.growingUnitsAtLimit}
						</Badge>
					</div>

					<div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
						<div className="flex items-center gap-2">
							<CheckCircleIcon className="h-5 w-5 text-red-600" />
							<span className="text-sm font-medium">{t("full")}</span>
						</div>
						<Badge
							variant="outline"
							className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700"
						>
							{overview.growingUnitsFull}
						</Badge>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
