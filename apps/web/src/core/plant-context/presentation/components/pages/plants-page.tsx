'use client';

import { PlantTableRow } from '@/core/plant-context/presentation/components/organisms/plant-table-row/plant-table-row';
import { PlantsPageSkeleton } from '@/core/plant-context/presentation/components/organisms/plants-page-skeleton/plants-page-skeleton';
import {
  SearchAndFilters,
  type FilterOption,
} from '@/shared/presentation/components/ui/search-and-filters/search-and-filters';
import { PageHeader } from '@repo/shared/presentation/components/organisms/page-header';
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
import { useState } from 'react';

export function PlantsPage() {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // TODO: Replace with actual data fetching when findByCriteria is available
  const plants: any[] = [];
  const isLoading = false;
  const error = null;

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

  // TODO: Implement when findByCriteria is available
  const handleView = (id: string) => {
    // Navigate to plant detail page
  };

  const handleEdit = (plant: any) => {
    // Open edit dialog
  };

  const handleDelete = (id: string) => {
    // Open delete confirmation
  };

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

      {/* Table */}
      {plants.length > 0 ? (
        <>
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
                {plants.map((plant) => (
                  <PlantTableRow
                    key={plant.id}
                    plant={plant}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {/* TODO: Implement pagination when findByCriteria is available
          {totalPages > 1 && (
            <>
              <div className="text-sm text-muted-foreground text-center">
                {t('plants.table.pagination.showing', {
                  from: (page - 1) * perPage + 1,
                  to: Math.min(page * perPage, total),
                  total: total,
                })}
              </div>
              <PaginatedResults
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(newPage) => {
                  setCurrentPage(newPage);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </>
          )}
          */}
        </>
      ) : (
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">{t('plants.empty')}</p>
        </div>
      )}
    </div>
  );
}
