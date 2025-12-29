'use client';

import type { GrowingUnitResponse } from '@repo/sdk';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@repo/shared/presentation/components/ui/alert-dialog';
import { Badge } from '@repo/shared/presentation/components/ui/badge';
import { Button } from '@repo/shared/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/shared/presentation/components/ui/card';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface GrowingUnitCardProps {
  growingUnit: GrowingUnitResponse;
  onEdit: (growingUnit: GrowingUnitResponse) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function GrowingUnitCard({
  growingUnit,
  onEdit,
  onDelete,
  isDeleting = false,
}: GrowingUnitCardProps) {
  const t = useTranslations();

  const formatDate = (date?: Date | null): string => {
    if (!date) return t('common.unknown');
    return new Date(date).toLocaleDateString();
  };

  const formatDimensions = (): string => {
    if (!growingUnit.dimensions) return t('growingUnit.common.noDimensions');
    const { length, width, height, unit } = growingUnit.dimensions;
    return `${length} × ${width} × ${height} ${unit}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{growingUnit.name}</CardTitle>
            <CardDescription>
              {t(`growingUnit.type.${growingUnit.type}`)}
            </CardDescription>
          </div>
          <Badge variant="secondary">
            {growingUnit.numberOfPlants} / {growingUnit.capacity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">
              {t('growingUnit.fields.capacity.label')}
            </div>
            <div className="font-medium">{growingUnit.capacity}</div>
          </div>
          <div>
            <div className="text-muted-foreground">
              {t('growingUnit.fields.remainingCapacity.label')}
            </div>
            <div className="font-medium">{growingUnit.remainingCapacity}</div>
          </div>
          <div>
            <div className="text-muted-foreground">
              {t('growingUnit.fields.volume.label')}
            </div>
            <div className="font-medium">{growingUnit.volume}</div>
          </div>
          {growingUnit.dimensions && (
            <div>
              <div className="text-muted-foreground">
                {t('growingUnit.fields.dimensions.label')}
              </div>
              <div className="font-medium text-xs">{formatDimensions()}</div>
            </div>
          )}
        </div>

        {growingUnit.plants.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-2">
              {t('growingUnit.fields.plants.label')} (
              {growingUnit.plants.length})
            </div>
            <div className="space-y-1">
              {growingUnit.plants.slice(0, 3).map((plant) => (
                <div key={plant.id} className="text-sm text-muted-foreground">
                  • {plant.name || plant.species || t('plant.common.unnamed')}
                </div>
              ))}
              {growingUnit.plants.length > 3 && (
                <div className="text-sm text-muted-foreground">
                  +{growingUnit.plants.length - 3}{' '}
                  {t('growingUnit.common.more')}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          {t('growingUnit.fields.createdAt.label')}:{' '}
          {formatDate(growingUnit.createdAt)}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(growingUnit)}
          className="flex-1"
        >
          <PencilIcon className="mr-2 h-4 w-4" />
          {t('growingUnit.actions.edit')}
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={isDeleting}>
              <TrashIcon className="mr-2 h-4 w-4" />
              {t('growingUnit.actions.delete')}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t('growingUnit.actions.delete.confirm.title')}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t('growingUnit.actions.delete.confirm.description', {
                  name: growingUnit.name,
                })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(growingUnit.id)}
                disabled={isDeleting}
              >
                {isDeleting
                  ? t('growingUnit.actions.delete.loading')
                  : t('growingUnit.actions.delete.label')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
