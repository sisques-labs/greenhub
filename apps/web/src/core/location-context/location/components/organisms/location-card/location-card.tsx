'use client';

import type { LocationResponse } from '@repo/sdk';
import { Badge } from '@repo/shared/presentation/components/ui/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@repo/shared/presentation/components/ui/card';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface LocationCardProps {
	location: LocationResponse;
}

export function LocationCard({ location }: LocationCardProps) {
	const t = useTranslations();
	const locale = useLocale();
	const router = useRouter();

	const handleCardClick = useCallback(() => {
		// TODO: Navigate to location detail page when implemented
		// router.push(`/${locale}/locations/${location.id}`);
	}, [router, locale, location.id]);

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
							{location.name}
						</span>
					</div>
					{/* Badge overlay in top-right corner */}
					<div className="absolute top-2 right-2">
						<Badge
							variant={location.type === 'OUTDOOR' ? 'default' : 'secondary'}
							className="text-xs"
						>
							{location.type}
						</Badge>
					</div>
				</div>

				<div className="p-4 space-y-2">
					<div>
						<CardTitle className="text-lg font-bold">
							{location.name}
						</CardTitle>
						<CardDescription className="text-xs uppercase mt-1">
							{location.type}
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-0 px-4 pb-4">
				{location.description ? (
					<div className="text-sm text-muted-foreground">
						{location.description}
					</div>
				) : (
					<div className="text-sm text-muted-foreground">
						{t('pages.locations.list.noDescription')}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

