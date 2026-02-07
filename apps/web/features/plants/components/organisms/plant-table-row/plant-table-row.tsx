'use client';

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@/shared/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/shared/components/ui/table';
import { formatPlantDate } from '@/shared/lib/date-utils';
import { getLocationIcon } from '@/shared/lib/icon-utils';
import { getPlantInitials } from '@/shared/lib/string-utils';
import { getPlantStatusBadge } from 'features/plants/utils/plant-status.utils';
import { MoreVerticalIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import type { PlantResponse } from '../../../api/types';

interface PlantTableRowProps {
	plant: PlantResponse;
	onEdit?: (plant: PlantResponse) => void;
	onDelete?: (id: string) => void;
}

export function PlantTableRow({ plant, onEdit, onDelete }: PlantTableRowProps) {
	const t = useTranslations();
	const locale = useLocale();
	const router = useRouter();

	const initials = getPlantInitials(plant.name, plant.species);

	const handleRowClick = () => {
		router.push(`/${locale}/plants/${plant.id}`);
	};

	const handleActionClick = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	return (
		<TableRow
			className="cursor-pointer hover:bg-muted/50 transition-colors"
			onClick={handleRowClick}
		>
			<TableCell>
				<Avatar className="h-10 w-10">
					<AvatarImage src={undefined} alt={plant.name || plant.species} />
					<AvatarFallback>{initials}</AvatarFallback>
				</Avatar>
			</TableCell>
			<TableCell>
				<div>
					<div className="font-medium">
						{plant.name || t('pages.plants.detail.unnamed')}
					</div>
					<div className="text-sm text-muted-foreground">
						{plant.species || '-'}
					</div>
				</div>
			</TableCell>
			<TableCell>
				{plant.location ? (
					<div className="flex items-center gap-2">
						{getLocationIcon()}
						<span className="text-sm">{plant.location.name}</span>
					</div>
				) : (
					<div className="flex items-center gap-2">
						{getLocationIcon()}
						<span className="text-sm text-muted-foreground">
							{t('common.unknown')}
						</span>
					</div>
				)}
			</TableCell>
			<TableCell>{getPlantStatusBadge(plant.status, t)}</TableCell>
			<TableCell>
				<span className="text-sm text-muted-foreground">
					{formatPlantDate(plant.updatedAt, {
						today: t('pages.plants.list.table.lastWatering.today'),
						yesterday: t('pages.plants.list.table.lastWatering.yesterday'),
						daysAgo: (days: number) =>
							t('pages.plants.list.table.lastWatering.daysAgo', { days }),
						weeksAgo: (weeks: number) =>
							t('pages.plants.list.table.lastWatering.weeksAgo', { weeks }),
					})}
				</span>
			</TableCell>
			<TableCell onClick={handleActionClick}>
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
							{t('pages.plants.list.actions.view')}
						</DropdownMenuItem>
						{onEdit && (
							<DropdownMenuItem onClick={() => onEdit(plant)}>
								{t('pages.plants.list.actions.edit')}
							</DropdownMenuItem>
						)}
						{onDelete && (
							<DropdownMenuItem
								onClick={() => onDelete(plant.id)}
								className="text-destructive"
							>
								{t('pages.plants.list.actions.delete')}
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	);
}
