"use client";

import { LocationCardSkeleton } from "features/locations/components/organisms/location-card-skeleton/location-card-skeleton";

interface LocationsCardsSkeletonProps {
	/**
	 * Number of skeleton cards to display
	 * @default 12
	 */
	cards?: number;
}

/**
 * Skeleton component for the locations cards grid only
 * Adapts to the number of cards specified to match the expected page size
 */
export function LocationsCardsSkeleton({ cards = 12 }: LocationsCardsSkeletonProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{Array.from({ length: cards }).map((_, i) => (
				<LocationCardSkeleton key={i} />
			))}
		</div>
	);
}

