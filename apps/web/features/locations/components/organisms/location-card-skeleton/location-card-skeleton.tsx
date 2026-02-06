'use client';

import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

/**
 * Skeleton component for a single location card
 */
export function LocationCardSkeleton() {
	return (
		<Card className="hover:shadow-lg transition-shadow overflow-hidden !pt-0">
			<CardHeader className="!p-0 !m-0">
				{/* Image with badge and menu skeleton */}
				<div className="relative w-full h-48 bg-muted">
					{/* Badge skeleton overlay */}
					<div className="absolute top-2 left-2">
						<Skeleton className="h-5 w-20 rounded-full" />
					</div>
					{/* Menu skeleton overlay */}
					<div className="absolute top-2 right-2">
						<Skeleton className="h-8 w-8 rounded-md" />
					</div>
				</div>

				<div className="p-4 space-y-2">
					<div>
						<Skeleton className="h-6 w-32 mb-2" />
						<Skeleton className="h-4 w-24" />
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-0 px-4 pb-4">
				<div>
					<Skeleton className="h-4 w-28 mb-2" />
					<div className="space-y-1">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
