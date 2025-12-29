'use client';

import { GrowingUnitUpdateForm } from '@/core/plant-context/presentation/components/organisms/growing-unit-update-form/growing-unit-update-form';
import { PlantCreateForm } from '@/core/plant-context/presentation/components/organisms/plant-create-form/plant-create-form';
import type { GrowingUnitUpdateFormValues } from '@/core/plant-context/presentation/dtos/schemas/growing-unit-update/growing-unit-update.schema';
import type { PlantCreateFormValues } from '@/core/plant-context/presentation/dtos/schemas/plant-create/plant-create.schema';
import { useGrowingUnitFindById } from '@/core/plant-context/presentation/hooks/use-growing-unit-find-by-id/use-growing-unit-find-by-id';
import { useGrowingUnitUpdate } from '@/core/plant-context/presentation/hooks/use-growing-unit-update/use-growing-unit-update';
import { usePlantAdd } from '@/core/plant-context/presentation/hooks/use-plant-add/use-plant-add';
import { useGrowingUnitDetailPageStore } from '@/core/plant-context/presentation/stores/growing-unit-detail-page-store';
import { PageHeader } from '@repo/shared/presentation/components/organisms/page-header';
import { Badge } from '@repo/shared/presentation/components/ui/badge';
import { Button } from '@repo/shared/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/shared/presentation/components/ui/card';
import { Skeleton } from '@repo/shared/presentation/components/ui/skeleton';
import {
  DropletsIcon,
  Grid3x3Icon,
  MountainIcon,
  PencilIcon,
  PlusIcon,
  SunIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export function GrowingUnitDetailPage() {
  const t = useTranslations();
  const params = useParams();
  const id = params?.id as string;

  const { growingUnit, isLoading, error, refetch } = useGrowingUnitFindById(
    id || '',
  );
  const {
    updateDialogOpen,
    setUpdateDialogOpen,
    createPlantDialogOpen,
    setCreatePlantDialogOpen,
  } = useGrowingUnitDetailPageStore();

  const {
    handleUpdate,
    isLoading: isUpdating,
    error: updateError,
  } = useGrowingUnitUpdate();

  const {
    handleCreate: handlePlantCreate,
    isLoading: isCreatingPlant,
    error: createPlantError,
  } = usePlantAdd();

  const handleUpdateSubmit = async (values: GrowingUnitUpdateFormValues) => {
    await handleUpdate(values, () => {
      refetch();
      setUpdateDialogOpen(false);
    });
  };

  const handlePlantCreateSubmit = async (values: PlantCreateFormValues) => {
    await handlePlantCreate(values, () => {
      refetch();
      setCreatePlantDialogOpen(false);
    });
  };

  const handleAddPlant = () => {
    setCreatePlantDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="mx-auto space-y-6">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !growingUnit) {
    return (
      <div className="mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-destructive">
            {t('growingUnit.detail.error.loading', {
              message: (error as Error)?.message || 'Unknown error',
            })}
          </p>
        </div>
      </div>
    );
  }

  // Determine location based on type
  // TODO: Add this to the backend
  const location =
    growingUnit.type === 'POT' || growingUnit.type === 'WINDOW_BOX'
      ? 'indoor'
      : 'outdoor';

  // TODO: Add this to the backend
  const occupancyPercentage = Math.round(
    (growingUnit.numberOfPlants / growingUnit.capacity) * 100,
  );

  return (
    <div className="mx-auto space-y-6">
      {/* Header */}
      <PageHeader
        title={growingUnit.name}
        description={
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge variant="default" className="bg-green-500">
                <span className="h-2 w-2 rounded-full bg-green-600 mr-2 inline-block" />
                {t('growingUnit.detail.status.active')}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {t('growingUnit.detail.location.label')}:{' '}
                {t(`growingUnit.detail.location.${location}`)}
              </span>
              <span className="text-sm text-muted-foreground">|</span>
              <span className="text-sm text-muted-foreground">
                {t('growingUnit.fields.type.label')}:{' '}
                {t(`growingUnit.type.${growingUnit.type}`)}
              </span>
            </div>
          </div>
        }
        actions={[
          <Button
            key="edit"
            variant="outline"
            onClick={() => setUpdateDialogOpen(true)}
          >
            <PencilIcon className="mr-2 h-4 w-4" />
            {t('growingUnit.detail.actions.editUnit')}
          </Button>,
          <Button key="add-plant" onClick={handleAddPlant}>
            <PlusIcon className="mr-2 h-4 w-4" />
            {t('growingUnit.detail.actions.addPlant')}
          </Button>,
        ]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('growingUnit.detail.summary.substrate.label')}
            </CardTitle>
            <MountainIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {t('growingUnit.detail.summary.substrate.value')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('growingUnit.detail.summary.exposure.label')}
            </CardTitle>
            <SunIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {t('growingUnit.detail.summary.exposure.directSun')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('growingUnit.detail.summary.lastWatering.label')}
            </CardTitle>
            <DropletsIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {t('growingUnit.detail.summary.lastWatering.today')}
            </div>
            <p className="text-xs text-muted-foreground">08:30 AM</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('growingUnit.detail.summary.occupancy.label')}
            </CardTitle>
            <Grid3x3Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyPercentage}%</div>
            <p className="text-xs text-muted-foreground">
              {growingUnit.numberOfPlants}/{growingUnit.capacity}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Plants Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('growingUnit.detail.plants.title')}</CardTitle>
            <Button variant="link" className="h-auto p-0">
              {t('growingUnit.detail.plants.viewAll')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {growingUnit.plants.length > 0 ? (
            <div className="space-y-4">
              {growingUnit.plants.map((plant) => (
                <div
                  key={plant.id}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">
                      {plant.name?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="font-semibold">{plant.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {t('growingUnit.detail.plants.variety')}: {plant.species}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t('growingUnit.detail.plants.planted')}{' '}
                      {plant.plantedDate
                        ? new Date(plant.plantedDate).toLocaleDateString()
                        : '-'}
                      {' • '}
                      {plant.plantedDate
                        ? Math.floor(
                            (new Date().getTime() -
                              new Date(plant.plantedDate).getTime()) /
                              (1000 * 60 * 60 * 24),
                          )
                        : 0}{' '}
                      {t('growingUnit.detail.plants.days')}
                    </div>
                  </div>
                  <Badge variant="outline">{plant.status}</Badge>
                  <Button variant="outline" size="sm">
                    {t('growingUnit.detail.plants.manage')}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {t('growingUnit.noPlants')}
            </div>
          )}
        </CardContent>
      </Card>

      {/* TODO: Add this to the backend */}
      {/* History Section - Placeholder */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('growingUnit.detail.history.title')}</CardTitle>
            <Button variant="link" className="h-auto p-0">
              {t('growingUnit.detail.history.viewAll')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            {t('common.loading')}
          </div>
        </CardContent>
      </Card>

      {/* Update Form */}
      {growingUnit && (
        <GrowingUnitUpdateForm
          growingUnit={growingUnit}
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
          onSubmit={handleUpdateSubmit}
          isLoading={isUpdating}
          error={updateError}
        />
      )}

      {/* Create Plant Form */}
      {growingUnit && (
        <PlantCreateForm
          open={createPlantDialogOpen}
          onOpenChange={setCreatePlantDialogOpen}
          onSubmit={handlePlantCreateSubmit}
          isLoading={isCreatingPlant}
          error={createPlantError}
          growingUnitId={growingUnit.id}
        />
      )}
    </div>
  );
}
