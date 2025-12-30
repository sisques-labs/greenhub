'use client';

import type { OverviewResponse } from '@repo/sdk';
import { Badge } from '@repo/shared/presentation/components/ui/badge';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@repo/shared/presentation/components/ui/card';
import {
	BoxIcon,
	CircleIcon,
	Grid3x3Icon,
	PackageIcon,
	SquareIcon,
} from 'lucide-react';

interface OverviewGrowingUnitsSectionProps {
	overview: OverviewResponse | null;
	isLoading?: boolean;
}

/**
 * Overview growing units section component
 * Displays growing unit metrics and type breakdown
 */
export function OverviewGrowingUnitsSection({
	overview,
	isLoading = false,
}: OverviewGrowingUnitsSectionProps) {
	// TODO: Add translations

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

	const typeBreakdown = [
		{
			label: 'Pots',
			value: overview.growingUnitsPot,
			icon: PackageIcon,
			color: 'text-blue-600',
			bgColor: 'bg-blue-50 dark:bg-blue-950/20',
		},
		{
			label: 'Garden Beds',
			value: overview.growingUnitsGardenBed,
			icon: SquareIcon,
			color: 'text-green-600',
			bgColor: 'bg-green-50 dark:bg-green-950/20',
		},
		{
			label: 'Hanging Baskets',
			value: overview.growingUnitsHangingBasket,
			icon: CircleIcon,
			color: 'text-purple-600',
			bgColor: 'bg-purple-50 dark:bg-purple-950/20',
		},
		{
			label: 'Window Boxes',
			value: overview.growingUnitsWindowBox,
			icon: BoxIcon,
			color: 'text-orange-600',
			bgColor: 'bg-orange-50 dark:bg-orange-950/20',
		},
	];

	const stats = [
		{
			label: 'Total Growing Units',
			value: overview.totalGrowingUnits,
			icon: Grid3x3Icon,
		},
		{
			label: 'Active',
			value: overview.activeGrowingUnits,
			icon: Grid3x3Icon,
			color: 'text-green-600',
		},
		{
			label: 'Empty',
			value: overview.emptyGrowingUnits,
			icon: Grid3x3Icon,
			color: 'text-gray-600',
		},
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Grid3x3Icon className="h-5 w-5 text-blue-600" />
					Growing Units Overview
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Main Stats */}
				<div className="grid gap-4 md:grid-cols-3">
					{stats.map((stat) => {
						const Icon = stat.icon;
						return (
							<div
								key={stat.label}
								className="text-center p-4 rounded-lg bg-muted/50"
							>
								<Icon
									className={`h-6 w-6 mx-auto mb-2 ${stat.color || 'text-muted-foreground'}`}
								/>
								<div className="text-2xl font-bold">
									{stat.value.toLocaleString()}
								</div>
								<div className="text-xs text-muted-foreground mt-1">
									{stat.label}
								</div>
							</div>
						);
					})}
				</div>

				{/* Type Breakdown */}
				<div className="space-y-3 pt-4 border-t">
					<div className="text-sm font-medium mb-3">By Type</div>
					<div className="grid gap-3 md:grid-cols-2">
						{typeBreakdown.map((type) => {
							const Icon = type.icon;
							const percentage =
								overview.totalGrowingUnits > 0
									? Math.round((type.value / overview.totalGrowingUnits) * 100)
									: 0;

							return (
								<div
									key={type.label}
									className={`flex items-center justify-between p-3 rounded-lg ${type.bgColor}`}
								>
									<div className="flex items-center gap-3">
										<Icon className={`h-5 w-5 ${type.color}`} />
										<div>
											<div className="text-sm font-medium">{type.label}</div>
											<div className="text-xs text-muted-foreground">
												{percentage}% of total
											</div>
										</div>
									</div>
									<Badge variant="secondary" className="font-semibold">
										{type.value}
									</Badge>
								</div>
							);
						})}
					</div>
				</div>

				{/* Aggregated Metrics */}
				<div className="grid gap-4 md:grid-cols-3 pt-4 border-t">
					<div className="text-center p-3 rounded-lg bg-muted/50">
						<div className="text-sm text-muted-foreground mb-1">
							Avg Plants/Unit
						</div>
						<div className="text-xl font-bold">
							{overview.averagePlantsPerGrowingUnit.toFixed(1)}
						</div>
					</div>
					<div className="text-center p-3 rounded-lg bg-muted/50">
						<div className="text-sm text-muted-foreground mb-1">Min</div>
						<div className="text-xl font-bold">
							{overview.minPlantsPerGrowingUnit}
						</div>
					</div>
					<div className="text-center p-3 rounded-lg bg-muted/50">
						<div className="text-sm text-muted-foreground mb-1">Max</div>
						<div className="text-xl font-bold">
							{overview.maxPlantsPerGrowingUnit}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
