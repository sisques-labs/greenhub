"use client";

import { PageHeader } from "@repo/shared/presentation/components/organisms/page-header";
import { Button } from "@repo/shared/presentation/components/ui/button";
import { RefreshCwIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { OverviewCapacitySection } from "@/generic/dashboard/components/organisms/overview-capacity-section/overview-capacity-section";
import { OverviewGrowingUnitsSection } from "@/generic/dashboard/components/organisms/overview-growing-units-section/overview-growing-units-section";
import { OverviewPlantsSection } from "@/generic/dashboard/components/organisms/overview-plants-section/overview-plants-section";
import { OverviewStatsCards } from "@/generic/dashboard/components/organisms/overview-stats-cards/overview-stats-cards";
import { useDashboardPage } from "@/generic/dashboard/hooks/use-dashboard-page/use-dashboard-page";

/**
 * Dashboard page component
 * Main dashboard that displays comprehensive overview of the entire system
 */
export function DashboardPage() {
	const t = useTranslations("dashboard");
	const { overview, isLoading, error } = useDashboardPage();

	if (error) {
		return (
			<div className="mx-auto py-8">
				<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
					<p className="text-destructive text-lg font-medium">
						{t("error.loading", {
							message: (error as Error).message,
						})}
					</p>
					<Button onClick={() => window.location.reload()} variant="outline">
						<RefreshCwIcon className="mr-2 h-4 w-4" />
						{t("common.retry")}
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto space-y-6">
			{/* Header */}
			<PageHeader title={t("page.title")} description={t("page.description")} />

			{/* Main Statistics Cards */}
			<OverviewStatsCards overview={overview} isLoading={isLoading} />

			{/* Plants Overview Section */}
			<OverviewPlantsSection overview={overview} isLoading={isLoading} />

			{/* Main Content Grid */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Capacity Overview */}
				<OverviewCapacitySection overview={overview} isLoading={isLoading} />

				{/* Growing Units Overview */}
				<OverviewGrowingUnitsSection
					overview={overview}
					isLoading={isLoading}
				/>
			</div>
		</div>
	);
}
