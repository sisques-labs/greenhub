'use client';

import { PlantsByGrowingUnitSection } from '@/core/plant-context/presentation/components/organisms/plants-by-growing-unit-section/plants-by-growing-unit-section';
import { PlantsPageSkeleton } from '@/core/plant-context/presentation/components/organisms/plants-page-skeleton/plants-page-skeleton';
import { useGrowingUnitsFindByCriteria } from '@/core/plant-context/presentation/hooks/use-growing-units-find-by-criteria/use-growing-units-find-by-criteria';
import {
  SearchAndFilters,
  type FilterOption,
} from '@/shared/presentation/components/ui/search-and-filters/search-and-filters';
import type { PlantResponse } from '@repo/sdk';
import { PageHeader } from '@repo/shared/presentation/components/organisms/page-header';
import { Button } from '@repo/shared/presentation/components/ui/button';
import {
  Building2Icon,
  CheckCircleIcon,
  DropletsIcon,
  HomeIcon,
  PlusIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

export function PlantsPage() {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Fetch growing units with their plants
  const paginationInput = useMemo(
    () => ({
      pagination: {
        page: 1,
        perPage: 100, // Get all growing units to show all plants
      },
    }),
    [],
  );

  const { growingUnits, isLoading, error } =
    useGrowingUnitsFindByCriteria(paginationInput);

  const filterOptions: FilterOption[] = [
    { value: 'all', label: t('plants.filters.all') },
    {
      value: 'indoor',
      label: t('plants.filters.indoor'),
      icon: HomeIcon,
    },
    {
      value: 'outdoor',
      label: t('plants.filters.outdoor'),
      icon: Building2Icon,
    },
    {
      value: 'needsWater',
      label: t('plants.filters.needsWater'),
      icon: DropletsIcon,
    },
    {
      value: 'healthy',
      label: t('plants.filters.healthy'),
      icon: CheckCircleIcon,
    },
  ];

  const handleEdit = (plant: PlantResponse) => {
    // TODO: Open edit dialog
  };

  const handleDelete = (id: string) => {
    // TODO: Open delete confirmation
  };

  // Calculate total plants across all growing units
  const totalPlants = useMemo(() => {
    if (!growingUnits) return 0;
    return growingUnits.items.reduce(
      (sum, unit) => sum + (unit.plants?.length || 0),
      0,
    );
  }, [growingUnits]);

  // Filter growing units that have plants after applying filters
  const growingUnitsWithPlants = useMemo(() => {
    if (!growingUnits) return [];

    return growingUnits.items.filter((unit) => {
      const plants = unit.plants || [];

      // If no search query and all filter, show all units with plants
      if (!searchQuery && selectedFilter === 'all') {
        return plants.length > 0;
      }

      // Apply filters
      let filtered = plants;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (plant) =>
            plant.name?.toLowerCase().includes(query) ||
            plant.species?.toLowerCase().includes(query) ||
            unit.name?.toLowerCase().includes(query),
        );
      }

      if (selectedFilter !== 'all') {
        switch (selectedFilter) {
          case 'healthy':
            filtered = filtered.filter((plant) => plant.status === 'HEALTHY');
            break;
          // TODO: Add more filter cases when needed
          default:
            break;
        }
      }

      return filtered.length > 0;
    });
  }, [growingUnits, searchQuery, selectedFilter]);

  if (isLoading) {
    return <PlantsPageSkeleton />;
  }

  if (error) {
    return (
      <div className="mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-destructive">
            {t('plant.error.loading', { message: (error as Error).message })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-6">
      {/* Header */}
      <PageHeader
        title={t('plants.title')}
        description={t('plants.description')}
        actions={[
          <Button key="create">
            <PlusIcon className="mr-2 h-4 w-4" />
            {t('plants.actions.create.button')}
          </Button>,
        ]}
      />

      {/* Search and Filters */}
      <SearchAndFilters
        searchPlaceholder={t('plants.search.placeholder')}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filterOptions={filterOptions}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />

      {/* Plants grouped by Growing Unit */}
      {growingUnitsWithPlants.length > 0 ? (
        <div className="space-y-8">
          {growingUnitsWithPlants.map((growingUnit) => (
            <PlantsByGrowingUnitSection
              key={growingUnit.id}
              growingUnit={growingUnit}
              searchQuery={searchQuery}
              selectedFilter={selectedFilter}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : totalPlants > 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">{t('plants.empty.filtered')}</p>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">{t('plants.empty')}</p>
        </div>
      )}
    </div>
  );
}
