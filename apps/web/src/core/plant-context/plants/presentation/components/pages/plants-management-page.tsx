'use client';

import { ContainerCreateForm } from '@/core/plant-context/containers/presentation/components/organisms/container-create-form/container-create-form';
import { useContainerDelete } from '@/core/plant-context/containers/presentation/hooks/use-container-delete/use-container-delete';
import { PlantCreateForm } from '@/core/plant-context/plants/presentation/components/organisms/plant-create-form/plant-create-form';
import { PlantsManagementPageSkeleton } from '@/core/plant-context/plants/presentation/components/organisms/plants-management-page-skeleton/plants-management-page-skeleton';
import { usePlantDelete } from '@/core/plant-context/plants/presentation/hooks/use-plant-delete/use-plant-delete';
import type { ContainerResponse, PlantResponse } from '@repo/sdk';
import { useContainersList, usePlantsList } from '@repo/sdk';
import { Button } from '@repo/shared/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/shared/presentation/components/ui/card';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function PlantsManagementPage() {
  const t = useTranslations();
  const [showPlantForm, setShowPlantForm] = useState(false);
  const [showContainerForm, setShowContainerForm] = useState(false);
  const [selectedContainerId, setSelectedContainerId] = useState<
    string | undefined
  >();

  const {
    data: plantsData,
    loading: isLoadingPlants,
    refetch: refetchPlants,
  } = usePlantsList();
  const {
    data: containersData,
    loading: isLoadingContainers,
    refetch: refetchContainers,
  } = useContainersList();

  const { handleDelete: handlePlantDelete } = usePlantDelete();
  const { handleDelete: handleContainerDelete } = useContainerDelete();

  const handlePlantDeleteClick = async (plant: PlantResponse) => {
    if (confirm(t('plants.actions.delete.confirm', { name: plant.name }))) {
      await handlePlantDelete(plant.id, () => {
        refetchPlants();
      });
    }
  };

  const handleContainerDeleteClick = async (container: ContainerResponse) => {
    if (
      confirm(t('containers.actions.delete.confirm', { name: container.name }))
    ) {
      await handleContainerDelete(container.id, () => {
        refetchContainers();
      });
    }
  };

  const handleSuccess = () => {
    refetchPlants();
    refetchContainers();
  };

  if (isLoadingContainers || isLoadingPlants) {
    return <PlantsManagementPageSkeleton />;
  }

  if (containersData?.items && containersData.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground mb-4">
          {t('plants.containers.empty')}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-6 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {t('plants.title')}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t('plants.description')}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            onClick={() => setShowContainerForm(true)}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('containers.actions.create.button')}
          </Button>
          <Button
            onClick={() => setShowPlantForm(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('plants.actions.create.button')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {containersData?.items && containersData.items.length > 0 ? (
          containersData.items.map((container) => (
            <Card key={container.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="truncate">{container.name}</CardTitle>
                    <CardDescription className="truncate">
                      {t('plants.containers.fields.type')}: {container.type}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        // TODO: Implement edit
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleContainerDeleteClick(container)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <p className="text-sm font-medium">
                      {t('plants.containers.plants')} (
                      {container.numberOfPlants})
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedContainerId(container.id);
                        setShowPlantForm(true);
                      }}
                      className="w-full sm:w-auto"
                    >
                      <Plus className="mr-2 h-3 w-3" />
                      {t('plants.actions.create.button')}
                    </Button>
                  </div>
                  {container.plants && container.plants.length > 0 ? (
                    <div className="space-y-2">
                      {container.plants.map((plant) => (
                        <Card key={plant.id} className="bg-muted/50">
                          <CardContent className="pt-4">
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm truncate">
                                  {plant.name}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1 truncate">
                                  {plant.species}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
                                  <span className="capitalize">
                                    {plant.status.toLowerCase()}
                                  </span>
                                  {plant.plantedDate && (
                                    <span>
                                      •{' '}
                                      {new Date(
                                        plant.plantedDate,
                                      ).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                                {plant.notes && (
                                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                                    {plant.notes}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-1 ml-2 shrink-0">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => {
                                    // TODO: Implement edit
                                  }}
                                >
                                  <Pencil className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-destructive hover:text-destructive"
                                  onClick={() =>
                                    handlePlantDeleteClick(
                                      plant as PlantResponse,
                                    )
                                  }
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">
                        {t('plants.containers.noPlants')}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">
              {t('plants.containers.empty')}
            </p>
            <Button onClick={() => setShowContainerForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t('containers.actions.create.button')}
            </Button>
          </div>
        )}
      </div>

      <PlantCreateForm
        containers={containersData?.items || []}
        open={showPlantForm}
        onOpenChange={(open) => {
          setShowPlantForm(open);
          if (!open) {
            setSelectedContainerId(undefined);
          }
        }}
        onSuccess={() => {
          handleSuccess();
          setSelectedContainerId(undefined);
        }}
        preselectedContainerId={selectedContainerId}
        onContainerCreated={() => {
          refetchContainers();
        }}
      />

      <ContainerCreateForm
        open={showContainerForm}
        onOpenChange={setShowContainerForm}
        onSuccess={(containerId) => {
          handleSuccess();
        }}
      />
    </div>
  );
}
