'use client';

import { LocationAddCard } from 'features/locations/components/organisms/location-add-card/location-add-card';
import { LocationCard } from 'features/locations/components/organisms/location-card/location-card';
import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { LocationResponse } from '../../../api/types';

interface LocationsVirtualizedGridProps {
	locations: LocationResponse[];
	onAddClick: () => void;
	onEdit?: (location: LocationResponse) => void;
	onDelete?: (id: string) => void;
}

export function LocationsVirtualizedGrid({
	locations,
	onAddClick,
	onEdit,
	onDelete,
}: LocationsVirtualizedGridProps) {
	const parentRef = useRef<HTMLDivElement>(null);

	// Calculate how many columns we have based on viewport width
	const getColumnCount = () => {
		if (typeof window === 'undefined') return 3;
		const width = window.innerWidth;
		if (width < 768) return 1; // mobile
		if (width < 1024) return 2; // tablet
		return 3; // desktop
	};

	const columnCount = getColumnCount();
	const items = [...locations, { id: 'add-card', isAddCard: true }];
	const rowCount = Math.ceil(items.length / columnCount);

	const virtualizer = useVirtualizer({
		count: rowCount,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 380, // Estimated card height + gap
		overscan: 2,
	});

	return (
		<div
			ref={parentRef}
			className="overflow-auto"
			style={{ height: '600px' }}
		>
			<div
				style={{
					height: `${virtualizer.getTotalSize()}px`,
					position: 'relative',
				}}
			>
				{virtualizer.getVirtualItems().map((virtualRow) => {
					const startIndex = virtualRow.index * columnCount;
					const endIndex = Math.min(startIndex + columnCount, items.length);
					const rowItems = items.slice(startIndex, endIndex);

					return (
						<div
							key={virtualRow.key}
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								height: `${virtualRow.size}px`,
								transform: `translateY(${virtualRow.start}px)`,
							}}
						>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
								{rowItems.map((item: any) =>
									item.isAddCard ? (
										<LocationAddCard key="add-card" onClick={onAddClick} />
									) : (
										<LocationCard
											key={item.id}
											location={item}
											onEdit={onEdit}
											onDelete={onDelete}
										/>
									),
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
