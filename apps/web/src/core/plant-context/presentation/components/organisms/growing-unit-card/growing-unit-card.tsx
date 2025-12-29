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
  onEdit?: (growingUnit: GrowingUnitResponse) => void;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
  showActions?: boolean;
}

export function GrowingUnitCard({
  growingUnit,
  onEdit,
  onDelete,
  isDeleting = false,
  showActions = false,
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

  // Determine location based on type (simplified logic - TODO: add location field)
  const location =
    growingUnit.type === 'POT' || growingUnit.type === 'WINDOW_BOX'
      ? 'INTERIOR'
      : 'EXTERIOR';

  return (
    <Card>
      <CardHeader>
        <div className="space-y-2">
          {/* Image placeholder - TODO: Replace with actual image when available */}
          <div className="w-full h-32 bg-muted rounded-md mb-2 flex items-center justify-center">
            <span className="text-muted-foreground text-sm">
              {t(`growingUnit.type.${growingUnit.type}`)}
            </span>
          </div>
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-lg font-semibold">
                {growingUnit.name}
              </CardTitle>
              <CardDescription className="text-xs uppercase">
                {t(`growingUnit.type.${growingUnit.type}`)}
              </CardDescription>
            </div>
          </div>
          <Badge
            variant={location === 'EXTERIOR' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {location}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {growingUnit.plants.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-2">
              {t('growingUnit.fields.plants.label')}:
            </div>
            <div className="space-y-1">
              {growingUnit.plants.map((plant, index) => (
                <div
                  key={plant.id}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
                    }}
                  />
                  <span>
                    {plant.name || plant.species || t('plant.common.unnamed')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        {growingUnit.plants.length === 0 && (
          <div className="text-sm text-muted-foreground">
            {t('growingUnit.noPlants')}
          </div>
        )}
      </CardContent>
      {showActions && (onEdit || onDelete) && (
        <CardFooter className="flex gap-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(growingUnit)}
              className="flex-1"
            >
              <PencilIcon className="mr-2 h-4 w-4" />
              {t('growingUnit.actions.edit')}
            </Button>
          )}
          {onDelete && (
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
          )}
        </CardFooter>
      )}
    </Card>
  );
}
