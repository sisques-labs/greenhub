'use client';

import { PlantTableRow } from '@/core/plant-context/presentation/components/organisms/plant-table-row/plant-table-row';
import { PlantsPageSkeleton } from '@/core/plant-context/presentation/components/organisms/plants-page-skeleton/plants-page-skeleton';
import { useGrowingUnitsFindByCriteria } from '@/core/plant-context/presentation/hooks/use-growing-units-find-by-criteria/use-growing-units-find-by-criteria';
import {
  SearchAndFilters,
  type FilterOption,
} from '@/shared/presentation/components/ui/search-and-filters/search-and-filters';
import { PLANT_STATUS, type PlantResponse } from '@repo/sdk';
import { PageHeader } from '@repo/shared/presentation/components/organisms/page-header';
import { TableLayout } from '@repo/shared/presentation/components/organisms/table-layout';
import { Button } from '@repo/shared/presentation/components/ui/button';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/shared/presentation/components/ui/table';
import {
  Building2Icon,
  CheckCircleIcon,
  DropletsIcon,
  HomeIcon,
  PlusIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

const PLANTS_PER_PAGE = 10;

export function PlantsPage() {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(PLANTS_PER_PAGE);

  // Fetch growing units with their plants
  const paginationInput = useMemo(
    () => ({
      pagination: {
        page: currentPage,
        perPage,
      },
    }),
    [perPage],
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

  // Flatten all plants from all growing units and apply filters
  const allFilteredPlants = useMemo(() => {
    if (!growingUnits) return [];

    // Flatten all plants with their growing unit info
    const allPlants: Array<PlantResponse & { growingUnitName?: string }> = [];
    growingUnits.items.forEach((unit) => {
      const plants = unit.plants || [];
      plants.forEach((plant) => {
        allPlants.push({
          ...plant,
          growingUnitName: unit.name,
        });
      });
    });

    // Apply search filter
    let filtered = allPlants;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (plant) =>
          plant.name?.toLowerCase().includes(query) ||
          plant.species?.toLowerCase().includes(query) ||
          plant.growingUnitName?.toLowerCase().includes(query),
      );
    }

    // Apply status filter
    if (selectedFilter !== 'all') {
      switch (selectedFilter) {
        case 'healthy':
          filtered = filtered.filter(
            (plant) => plant.status === PLANT_STATUS.GROWING,
          );
          break;
        // TODO: Add more filter cases when needed
        default:
          break;
      }
    }

    return filtered;
  }, [growingUnits, searchQuery, selectedFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(allFilteredPlants.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedPlants = allFilteredPlants.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedFilter, perPage]);

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

      {/* Plants Table with Pagination */}
      <TableLayout
        page={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
          // Scroll to top when page changes
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        perPage={perPage}
        onPerPageChange={setPerPage}
      >
        {allFilteredPlants.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">IMG</TableHead>
                  <TableHead>{t('plants.table.columns.plant')}</TableHead>
                  <TableHead>{t('plants.table.columns.location')}</TableHead>
                  <TableHead>{t('plants.table.columns.status')}</TableHead>
                  <TableHead>
                    {t('plants.table.columns.lastWatering')}
                  </TableHead>
                  <TableHead className="w-[80px]">
                    {t('plants.table.columns.actions')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPlants.map((plant) => (
                  <PlantTableRow
                    key={plant.id}
                    plant={plant}
                    growingUnitName={plant.growingUnitName}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-muted-foreground">
              {growingUnits &&
              growingUnits.items.some((unit) => (unit.plants?.length || 0) > 0)
                ? t('plants.empty.filtered')
                : t('plants.empty')}
            </p>
          </div>
        )}
      </TableLayout>
    </div>
  );
}
