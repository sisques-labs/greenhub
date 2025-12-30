'use client';

import { PlantTableRow } from '@/core/plant-context/plant/components/organisms/plant-table-row/plant-table-row';
import { PlantsPageSkeleton } from '@/core/plant-context/plant/components/organisms/plants-page-skeleton/plants-page-skeleton';
import { usePlantsPage } from '@/core/plant-context/plant/hooks/use-plants-page/use-plants-page';
import {
  SearchAndFilters,
  type FilterOption,
} from '@/shared/components/ui/search-and-filters/search-and-filters';
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

export function PlantsPage() {
  const t = useTranslations();

  const {
    searchQuery,
    setSearchQuery,
    selectedFilter,
    setSelectedFilter,
    currentPage,
    perPage,
    setPerPage,
    allFilteredPlants,
    paginatedPlants,
    totalPages,
    isLoading,
    error,
    handleEdit,
    handleDelete,
    handlePageChange,
    hasAnyPlants,
  } = usePlantsPage();

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
        onPageChange={handlePageChange}
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
              {hasAnyPlants ? t('plants.empty.filtered') : t('plants.empty')}
            </p>
          </div>
        )}
      </TableLayout>
    </div>
  );
}
