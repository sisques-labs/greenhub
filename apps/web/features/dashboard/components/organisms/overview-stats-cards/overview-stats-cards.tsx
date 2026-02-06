'use client';

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/card';
import type { OverviewResponse } from 'features/dashboard/api/types';
import {
	AlertTriangleIcon,
	FlowerIcon,
	Grid3x3Icon,
	PackageIcon,
	TrendingUpIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

interface OverviewStatsCardsProps {
	overview: OverviewResponse | null;
	isLoading?: boolean;
}

/**
 * Overview statistics cards component
 * Displays key metrics from the overview: Total Plants, Active Units, Ready for Harvest, Critical Alerts
 */
export function OverviewStatsCards({
	overview,
	isLoading = false,
}: OverviewStatsCardsProps) {
	const t = useTranslations('dashboard.stats');
	const tCommon = useTranslations('dashboard.common');

	if (isLoading || !overview) {
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

	const criticalAlerts =
		overview.growingUnitsAtLimit + overview.growingUnitsFull;

	const stats = [
		{
			title: t('totalPlants.title'),
			value: overview.totalPlants.toLocaleString(),
			subtitle: `${overview.totalActivePlants} ${tCommon('active')}`,
			icon: FlowerIcon,
			iconColor: 'text-green-600',
			bgColor: 'bg-green-50 dark:bg-green-950/20',
		},
		{
			title: t('activeUnits.title'),
			value: overview.activeGrowingUnits.toString(),
			subtitle: `${overview.totalGrowingUnits} ${tCommon('total')}`,
			icon: Grid3x3Icon,
			iconColor: 'text-blue-600',
			bgColor: 'bg-blue-50 dark:bg-blue-950/20',
		},
		{
			title: t('readyForHarvest.title'),
			value: overview.plantsHarvested.toString(),
			subtitle: `${overview.plantsGrowing} ${tCommon('growing')}`,
			icon: PackageIcon,
			iconColor: 'text-orange-600',
			bgColor: 'bg-orange-50 dark:bg-orange-950/20',
		},
		{
			title: t('criticalAlerts.title'),
			value: criticalAlerts.toString(),
			subtitle: `${overview.growingUnitsAtLimit} ${tCommon('atLimit')}`,
			icon: AlertTriangleIcon,
			iconColor: 'text-red-600',
			bgColor: 'bg-red-50 dark:bg-red-950/20',
		},
	];

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{stats.map((stat) => {
				const Icon = stat.icon;

				return (
					<Card key={stat.title} className="relative overflow-hidden">
						<div
							className={`absolute top-0 right-0 w-32 h-32 ${stat.bgColor} rounded-full -mr-16 -mt-16 opacity-50`}
						/>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
							<CardTitle className="text-sm font-medium">
								{stat.title}
							</CardTitle>
							<Icon className={`h-5 w-5 ${stat.iconColor} relative z-10`} />
						</CardHeader>
						<CardContent className="relative z-10">
							<div className="text-3xl font-bold mb-1">{stat.value}</div>
							<p className="text-xs text-muted-foreground flex items-center gap-1">
								<TrendingUpIcon className="h-3 w-3 text-muted-foreground" />
								<span>{stat.subtitle}</span>
							</p>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
