'use client';

import { Badge } from '@/shared/components/ui/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/card';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import type { GrowingUnitResponse } from '../../../api/types';

interface GrowingUnitCardProps {
	growingUnit: GrowingUnitResponse;
}

export function GrowingUnitCard({ growingUnit }: GrowingUnitCardProps) {
	const t = useTranslations();
	const locale = useLocale();
	const router = useRouter();

	// Determine location based on type
	const location =
		growingUnit.type === 'POT' || growingUnit.type === 'WINDOW_BOX'
			? 'INTERIOR'
			: 'EXTERIOR';

	const handleCardClick = useCallback(() => {
		router.push(`/${locale}/growing-units/${growingUnit.id}`);
	}, [router, locale, growingUnit.id]);

	// Show only first 3 plants and add "+X más" if there are more
	const visiblePlants = growingUnit.plants.slice(0, 3);
	const remainingPlantsCount = growingUnit.plants.length - 3;

	return (
		<Card
			className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden !pt-0"
			onClick={handleCardClick}
		>
			<CardHeader className="!p-0 !m-0">
				{/* Image with badge overlay */}
				<div className="relative w-full h-48 bg-muted">
					{/* Image placeholder - TODO: Replace with actual image when available */}
					<div className="w-full h-full flex items-center justify-center">
						<span className="text-muted-foreground text-sm">
							{t(`shared.types.growingUnit.${growingUnit.type}`)}
						</span>
					</div>
					{/* Badge overlay in top-right corner */}
					<div className="absolute top-2 right-2">
						<Badge
							variant={location === 'EXTERIOR' ? 'default' : 'secondary'}
							className="text-xs"
						>
							{location}
						</Badge>
					</div>
				</div>

				<div className="p-4 space-y-2">
					<div>
						<CardTitle className="text-lg font-bold">
							{growingUnit.name}
						</CardTitle>
						<CardDescription className="text-xs uppercase mt-1">
							{t(`shared.types.growingUnit.${growingUnit.type}`)}
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-0 px-4 pb-4">
				{growingUnit.plants.length > 0 ? (
					<div>
						<div className="text-sm font-medium mb-2">
							{t('shared.fields.plants.label')}:
						</div>
						<div className="space-y-1">
							{visiblePlants.map((plant) => (
								<div
									key={plant.id}
									className="flex items-center gap-2 text-sm text-muted-foreground"
								>
									<div className="h-1.5 w-1.5 rounded-full bg-current" />
									<span>
										{plant.name ||
											plant.species ||
											t('pages.plants.detail.unnamed')}
									</span>
								</div>
							))}
							{remainingPlantsCount > 0 && (
								<div className="text-sm text-muted-foreground font-medium">
									+{remainingPlantsCount} {t('common.more')}
								</div>
							)}
						</div>
					</div>
				) : (
					<div className="text-sm text-muted-foreground">
						{t('pages.growingUnits.list.noPlants')}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
