'use client';

import type { GrowingUnitResponse } from '@/features/growing-units/api/types';
import type { PlantResponse } from '@/features/plants/api/types';
import { PlantTableRow } from '@/features/plants/components/organisms/plant-table-row/plant-table-row';
import type { PlantFilterType } from '@/features/plants/hooks/use-plants-filtering/use-plants-filtering';
import { usePlantsFiltering } from '@/features/plants/hooks/use-plants-filtering/use-plants-filtering';
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from '@/shared/components/ui/table';
import { useTranslations } from 'next-intl';

interface PlantsByGrowingUnitSectionProps {
	growingUnit: GrowingUnitResponse;
	searchQuery?: string;
	selectedFilter?: PlantFilterType;
	onEdit?: (plant: PlantResponse) => void;
	onDelete?: (id: string) => void;
}

export function PlantsByGrowingUnitSection({
	growingUnit,
	searchQuery = '',
	selectedFilter = 'all',
	onEdit,
	onDelete,
}: PlantsByGrowingUnitSectionProps) {
	const t = useTranslations();

	const { filteredPlants } = usePlantsFiltering({
		plants: growingUnit.plants || [],
		searchQuery,
		selectedFilter,
		growingUnitName: growingUnit.name,
	});

	// Don't render section if no plants after filtering
	if (filteredPlants.length === 0) {
		return null;
	}

	return (
		<div className="space-y-4">
			{/* Growing Unit Header */}
			<div className="flex items-center justify-between border-b pb-2">
				<div>
					<h3 className="text-lg font-semibold">{growingUnit.name}</h3>
					<p className="text-sm text-muted-foreground">
						{t('pages.plants.list.growingUnit.plantCount', {
							count: filteredPlants.length,
							total: growingUnit.numberOfPlants,
						})}
					</p>
				</div>
			</div>

			{/* Plants Table */}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[80px]">IMG</TableHead>
							<TableHead>
								{t('pages.plants.list.table.columns.plant')}
							</TableHead>
							<TableHead>
								{t('pages.plants.list.table.columns.location')}
							</TableHead>
							<TableHead>
								{t('pages.plants.list.table.columns.status')}
							</TableHead>
							<TableHead>
								{t('pages.plants.list.table.columns.lastWatering')}
							</TableHead>
							<TableHead className="w-[80px]">
								{t('pages.plants.list.table.columns.actions')}
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredPlants.map((plant) => (
							<PlantTableRow
								key={plant.id}
								plant={plant}
								onEdit={onEdit}
								onDelete={onDelete}
							/>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
