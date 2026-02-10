'use client';

import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from '@/shared/components/ui/table';
import { PlantTableRow } from '@/features/plants/components/organisms/plant-table-row/plant-table-row';
import type { PlantWithGrowingUnit } from '@/features/plants/hooks/use-plants-page/use-plants-page';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { PlantResponse } from '@/features/plants/api/types';

interface PlantsVirtualizedTableProps {
	plants: PlantWithGrowingUnit[];
	onEdit: (plant: PlantResponse) => void;
	onDelete: (id: string) => void;
}

export function PlantsVirtualizedTable({
	plants,
	onEdit,
	onDelete,
}: PlantsVirtualizedTableProps) {
	const t = useTranslations();
	const parentRef = useRef<HTMLDivElement>(null);

	const virtualizer = useVirtualizer({
		count: plants.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 73, // Estimated row height in pixels
		overscan: 5, // Render 5 extra items above/below viewport for smooth scrolling
	});

	return (
		<div ref={parentRef} className="rounded-md border overflow-auto" style={{ height: '600px' }}>
			<Table>
				<TableHeader className="sticky top-0 bg-background z-10">
					<TableRow>
						<TableHead className="w-[80px]">IMG</TableHead>
						<TableHead>{t('features.plants.list.table.columns.plant')}</TableHead>
						<TableHead>
							{t('features.plants.list.table.columns.location')}
						</TableHead>
						<TableHead>{t('features.plants.list.table.columns.status')}</TableHead>
						<TableHead>
							{t('features.plants.list.table.columns.lastWatering')}
						</TableHead>
						<TableHead className="w-[80px]">
							{t('features.plants.list.table.columns.actions')}
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody
					style={{
						height: `${virtualizer.getTotalSize()}px`,
						position: 'relative',
					}}
				>
					{virtualizer.getVirtualItems().map((virtualRow) => {
						const plant = plants[virtualRow.index];
						return (
							<div
								key={plant.id}
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									width: '100%',
									height: `${virtualRow.size}px`,
									transform: `translateY(${virtualRow.start}px)`,
								}}
							>
								<PlantTableRow
									plant={plant}
									onEdit={onEdit}
									onDelete={onDelete}
								/>
							</div>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
