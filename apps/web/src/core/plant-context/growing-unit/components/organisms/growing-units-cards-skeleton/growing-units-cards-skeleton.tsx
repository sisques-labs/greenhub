"use client";

import { GrowingUnitCardSkeleton } from "@/core/plant-context/growing-unit/components/organisms/growing-units-page-skeleton/growing-units-page-skeleton";

interface GrowingUnitsCardsSkeletonProps {
	/**
	 * Number of skeleton cards to display
	 * @default 12
	 */
	cards?: number;
}

/**
 * Skeleton component for the growing units cards grid only
 * Adapts to the number of cards specified to match the expected page size
 */
export function GrowingUnitsCardsSkeleton({ cards = 12 }: GrowingUnitsCardsSkeletonProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{Array.from({ length: cards }).map((_, i) => (
				<GrowingUnitCardSkeleton key={i} />
			))}
		</div>
	);
}

