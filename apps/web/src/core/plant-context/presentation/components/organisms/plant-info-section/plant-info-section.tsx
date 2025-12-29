'use client';

import type { PlantResponse } from '@repo/sdk';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/shared/presentation/components/ui/card';
import { useTranslations } from 'next-intl';

interface PlantInfoSectionProps {
  plant: PlantResponse;
}

export function PlantInfoSection({ plant }: PlantInfoSectionProps) {
  const t = useTranslations();

  const formatDate = (date?: Date | null): string => {
    if (!date) return t('plant.common.notSet');
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('plant.sections.info.title')}</CardTitle>
        <CardDescription>
          {t('plant.sections.info.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              {t('plant.fields.name.label')}
            </div>
            <div className="text-base">
              {plant.name || t('plant.common.notSet')}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              {t('plant.fields.species.label')}
            </div>
            <div className="text-base">
              {plant.species || t('plant.common.notSet')}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              {t('plant.fields.status.label')}
            </div>
            <div className="text-base">{t(`plant.status.${plant.status}`)}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              {t('plant.fields.plantedDate.label')}
            </div>
            <div className="text-base">{formatDate(plant.plantedDate)}</div>
          </div>
          <div className="sm:col-span-2">
            <div className="text-sm font-medium text-muted-foreground">
              {t('plant.fields.growingUnitId.label')}
            </div>
            <div className="text-base">{plant.growingUnitId}</div>
          </div>
        </div>
        {plant.notes && (
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-2">
              {t('plant.fields.notes.label')}
            </div>
            <div className="text-base whitespace-pre-wrap">{plant.notes}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
