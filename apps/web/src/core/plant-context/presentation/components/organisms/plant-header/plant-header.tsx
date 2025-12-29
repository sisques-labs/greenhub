'use client';

import type { PlantResponse } from '@repo/sdk';
import { Badge } from '@repo/shared/presentation/components/ui/badge';
import {
  Card,
  CardContent,
} from '@repo/shared/presentation/components/ui/card';
import { useTranslations } from 'next-intl';

interface PlantHeaderProps {
  plant: PlantResponse;
}

export function PlantHeader({ plant }: PlantHeaderProps) {
  const t = useTranslations();

  const formatDate = (date?: Date | null): string => {
    if (!date) return t('plant.common.notSet');
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <h1 className="text-3xl font-bold">
              {plant.name || t('plant.common.unnamed')}
            </h1>
            <Badge
              variant={
                plant.status === 'GROWING'
                  ? 'default'
                  : plant.status === 'HARVESTED'
                    ? 'secondary'
                    : 'outline'
              }
            >
              {t(`plant.status.${plant.status}`)}
            </Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">
                {t('plant.fields.species.label')}:
              </span>{' '}
              {plant.species || t('plant.common.notSet')}
            </div>
            <div>
              <span className="font-medium">
                {t('plant.fields.plantedDate.label')}:
              </span>{' '}
              {formatDate(plant.plantedDate)}
            </div>
            <div className="sm:col-span-2">
              <span className="font-medium">
                {t('plant.fields.growingUnitId.label')}:
              </span>{' '}
              {plant.growingUnitId}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
