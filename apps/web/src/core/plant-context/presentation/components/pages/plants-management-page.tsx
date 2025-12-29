'use client';

import { GrowingUnitCard } from '@/core/plant-context/presentation/components/organisms/growing-unit-card/growing-unit-card';
import { GrowingUnitCreateForm } from '@/core/plant-context/presentation/components/organisms/growing-unit-create-form/growing-unit-create-form';
import { GrowingUnitUpdateForm } from '@/core/plant-context/presentation/components/organisms/growing-unit-update-form/growing-unit-update-form';
import type { GrowingUnitCreateFormValues } from '@/core/plant-context/presentation/dtos/schemas/growing-unit-create/growing-unit-create.schema';
import type { GrowingUnitUpdateFormValues } from '@/core/plant-context/presentation/dtos/schemas/growing-unit-update/growing-unit-update.schema';
import { useGrowingUnitCreate } from '@/core/plant-context/presentation/hooks/use-growing-unit-create/use-growing-unit-create';
import { useGrowingUnitDelete } from '@/core/plant-context/presentation/hooks/use-growing-unit-delete/use-growing-unit-delete';
import { useGrowingUnitUpdate } from '@/core/plant-context/presentation/hooks/use-growing-unit-update/use-growing-unit-update';
import { useGrowingUnitsFindByCriteria } from '@/core/plant-context/presentation/hooks/use-growing-units-find-by-criteria/use-growing-units-find-by-criteria';
import type { GrowingUnitResponse } from '@repo/sdk';
import { Button } from '@repo/shared/presentation/components/ui/button';
import { Skeleton } from '@repo/shared/presentation/components/ui/skeleton';
import { PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function PlantsManagementPage() {
  const t = useTranslations();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedGrowingUnit, setSelectedGrowingUnit] =
    useState<GrowingUnitResponse | null>(null);

  const {
    growingUnits,
    isLoading: isLoadingGrowingUnits,
    error: growingUnitsError,
    refetch,
  } = useGrowingUnitsFindByCriteria();

  const {
    handleCreate,
    isLoading: isCreating,
    error: createError,
  } = useGrowingUnitCreate();

  const {
    handleUpdate,
    isLoading: isUpdating,
    error: updateError,
  } = useGrowingUnitUpdate();

  const {
    handleDelete,
    isLoading: isDeleting,
    error: deleteError,
  } = useGrowingUnitDelete();

  const handleCreateSubmit = async (values: GrowingUnitCreateFormValues) => {
    await handleCreate(values, () => {
      refetch();
    });
  };

  const handleUpdateSubmit = async (values: GrowingUnitUpdateFormValues) => {
    await handleUpdate(values, () => {
      refetch();
      setUpdateDialogOpen(false);
      setSelectedGrowingUnit(null);
    });
  };

  const handleEdit = (growingUnit: GrowingUnitResponse) => {
    setSelectedGrowingUnit(growingUnit);
    setUpdateDialogOpen(true);
  };

  const handleDeleteConfirm = async (id: string) => {
    await handleDelete(id, () => {
      refetch();
    });
  };

  if (isLoadingGrowingUnits) {
    return (
      <div className="mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (growingUnitsError) {
    return (
      <div className="mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-destructive">
            {t('growingUnit.error.loading', {
              message: growingUnitsError.message,
            })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('plants.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('plants.description')}
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          {t('growingUnit.actions.create.button')}
        </Button>
      </div>

      {/* Growing Units Grid */}
      {growingUnits && growingUnits.items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {growingUnits.items.map((growingUnit) => (
            <GrowingUnitCard
              key={growingUnit.id}
              growingUnit={growingUnit}
              onEdit={handleEdit}
              onDelete={handleDeleteConfirm}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">
            {t('plants.containers.empty')}
          </p>
        </div>
      )}

      {/* Pagination Info */}
      {growingUnits && growingUnits.total > 0 && (
        <div className="text-sm text-muted-foreground text-center">
          {t('growingUnit.pagination.info', {
            page: growingUnits.page,
            totalPages: growingUnits.totalPages,
            total: growingUnits.total,
          })}
        </div>
      )}

      {/* Create Dialog */}
      <GrowingUnitCreateForm
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateSubmit}
        isLoading={isCreating}
        error={createError}
      />

      {/* Update Dialog */}
      <GrowingUnitUpdateForm
        growingUnit={selectedGrowingUnit}
        open={updateDialogOpen}
        onOpenChange={(open) => {
          setUpdateDialogOpen(open);
          if (!open) {
            setSelectedGrowingUnit(null);
          }
        }}
        onSubmit={handleUpdateSubmit}
        isLoading={isUpdating}
        error={updateError}
      />
    </div>
  );
}
