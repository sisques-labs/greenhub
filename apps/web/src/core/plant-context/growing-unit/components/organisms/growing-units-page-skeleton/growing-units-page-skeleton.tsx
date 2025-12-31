'use client';

import {
	Card,
	CardContent,
	CardHeader,
} from '@repo/shared/presentation/components/ui/card';
import { Skeleton } from '@repo/shared/presentation/components/ui/skeleton';
import {
	PageHeaderSkeleton,
	SearchAndFiltersSkeleton,
} from '@/shared/components/ui/page-skeleton/page-skeleton';

/**
 * Skeleton component for a single growing unit card
 */
function GrowingUnitCardSkeleton() {
	return (
		<Card className="!pt-0 overflow-hidden">
			<CardHeader className="!p-0 !m-0">
				{/* Image skeleton */}
				<div className="relative w-full">
					<Skeleton className="w-full h-48 rounded-t-lg" />
					{/* Badge skeleton overlay */}
					<div className="absolute top-2 right-2">
						<Skeleton className="h-5 w-20 rounded-full" />
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
						<div className="flex items-center gap-2">
							<Skeleton className="h-1.5 w-1.5 rounded-full" />
							<Skeleton className="h-4 w-24" />
						</div>
						<div className="flex items-center gap-2">
							<Skeleton className="h-1.5 w-1.5 rounded-full" />
							<Skeleton className="h-4 w-20" />
						</div>
						<div className="flex items-center gap-2">
							<Skeleton className="h-1.5 w-1.5 rounded-full" />
							<Skeleton className="h-4 w-28" />
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

/**
 * Skeleton component for the growing units page
 */
export function GrowingUnitsPageSkeleton() {
	return (
		<div className="mx-auto space-y-6">
			{/* Header */}
			<PageHeaderSkeleton />

			{/* Search and Filters */}
			<SearchAndFiltersSkeleton />

			{/* Grid Skeleton */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{[1, 2, 3, 4, 5, 6].map((i) => (
					<GrowingUnitCardSkeleton key={i} />
				))}
			</div>

			{/* Pagination Skeleton */}
			<div className="flex items-center justify-center">
				<div className="flex gap-2">
					<Skeleton className="h-9 w-9" />
					<Skeleton className="h-9 w-9" />
					<Skeleton className="h-9 w-9" />
					<Skeleton className="h-9 w-9" />
					<Skeleton className="h-9 w-9" />
				</div>
			</div>
		</div>
	);
}
