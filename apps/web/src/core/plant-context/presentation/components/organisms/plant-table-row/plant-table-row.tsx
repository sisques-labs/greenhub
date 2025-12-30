'use client';

import { getPlantStatusBadge } from '@/core/plant-context/presentation/utils/plant-status.utils';
import type { PlantResponse } from '@repo/sdk';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/shared/presentation/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/shared/presentation/components/ui/dropdown-menu';
import {
  TableCell,
  TableRow,
} from '@repo/shared/presentation/components/ui/table';
import { HomeIcon, MoreVerticalIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

interface PlantTableRowProps {
  plant: PlantResponse;
  onEdit?: (plant: PlantResponse) => void;
  onDelete?: (id: string) => void;
}

export function PlantTableRow({ plant, onEdit, onDelete }: PlantTableRowProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const formatDate = (date?: Date | null): string => {
    if (!date) return '-';
    const now = new Date();
    const plantDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - plantDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t('plants.table.lastWatering.today');
    if (diffDays === 1) return t('plants.table.lastWatering.yesterday');
    if (diffDays < 7)
      return t('plants.table.lastWatering.daysAgo', { days: diffDays });
    if (diffDays < 14)
      return t('plants.table.lastWatering.weeksAgo', {
        weeks: Math.floor(diffDays / 7),
      });
    return plantDate.toLocaleDateString();
  };

  const getLocationIcon = () => {
    // TODO: This should come from plant data when available
    return <HomeIcon className="h-4 w-4" />;
  };

  const initials = (plant.name || plant.species || 'P')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <TableRow>
      <TableCell>
        <Avatar className="h-10 w-10">
          <AvatarImage src={undefined} alt={plant.name || plant.species} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell>
        <div>
          <div className="font-medium">
            {plant.name || t('plant.common.unnamed')}
          </div>
          <div className="text-sm text-muted-foreground">
            {plant.species || '-'}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {getLocationIcon()}
          <span className="text-sm">
            {plant.growingUnitId || t('common.unknown')}
          </span>
        </div>
      </TableCell>
      <TableCell>{getPlantStatusBadge(plant.status, t)}</TableCell>
      <TableCell>
        <span className="text-sm text-muted-foreground">
          {formatDate(plant.updatedAt)}
        </span>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent">
              <MoreVerticalIcon className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => router.push(`/${locale}/plants/${plant.id}`)}
            >
              {t('plants.actions.view')}
            </DropdownMenuItem>
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(plant)}>
                {t('plants.actions.edit')}
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(plant.id)}
                className="text-destructive"
              >
                {t('plants.actions.delete')}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
