'use client';

import { PlantTableRow } from '@/core/plant-context/presentation/components/organisms/plant-table-row/plant-table-row';
import {
  PLANT_STATUS,
  type GrowingUnitResponse,
  type PlantResponse,
} from '@repo/sdk';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/shared/presentation/components/ui/table';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface PlantsByGrowingUnitSectionProps {
  growingUnit: GrowingUnitResponse;
  searchQuery?: string;
  selectedFilter?: string;
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

  // Filter plants based on search query and filter
  const filteredPlants = useMemo(() => {
    let plants = growingUnit.plants || [];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      plants = plants.filter(
        (plant) =>
          plant.name?.toLowerCase().includes(query) ||
          plant.species?.toLowerCase().includes(query) ||
          growingUnit.name?.toLowerCase().includes(query),
      );
    }

    // Apply status filter
    if (selectedFilter !== 'all') {
      switch (selectedFilter) {
        case 'needsWater':
          // TODO: Implement needs water filter when status logic is available
          break;
        case 'healthy':
          // TODO: Implement healthy filter when health status logic is available
          plants = plants.filter(
            (plant) => plant.status === PLANT_STATUS.GROWING,
          );
          break;
        default:
          break;
      }
    }

    return plants;
  }, [growingUnit.plants, searchQuery, selectedFilter, growingUnit.name]);

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
            {t('plants.growingUnit.plantCount', {
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
              <TableHead>{t('plants.table.columns.plant')}</TableHead>
              <TableHead>{t('plants.table.columns.location')}</TableHead>
              <TableHead>{t('plants.table.columns.status')}</TableHead>
              <TableHead>{t('plants.table.columns.lastWatering')}</TableHead>
              <TableHead className="w-[80px]">
                {t('plants.table.columns.actions')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlants.map((plant) => (
              <PlantTableRow
                key={plant.id}
                plant={plant}
                growingUnitName={growingUnit.name}
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
