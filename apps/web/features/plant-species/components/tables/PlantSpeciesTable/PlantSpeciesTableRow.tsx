'use client';

import type { PlantSpeciesResponse } from '@/features/plant-species/api/types/plant-species-response.types';
import { PLANT_SPECIES_CATEGORIES } from '@/features/plant-species/constants/plant-species-categories';
import { PLANT_SPECIES_DIFFICULTY } from '@/features/plant-species/constants/plant-species-difficulty';
import { Badge } from '@/shared/components/ui/badge';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/shared/components/ui/table';
import { MoreVerticalIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PlantSpeciesTableRowProps {
	plantSpecies: PlantSpeciesResponse;
	onView?: (plantSpecies: PlantSpeciesResponse) => void;
	onEdit?: (plantSpecies: PlantSpeciesResponse) => void;
	onDelete?: (id: string) => void;
}

export function PlantSpeciesTableRow({
	plantSpecies,
	onView,
	onEdit,
	onDelete,
}: PlantSpeciesTableRowProps) {
	const t = useTranslations();

	const categoryInfo = PLANT_SPECIES_CATEGORIES[plantSpecies.category];
	const difficultyInfo = PLANT_SPECIES_DIFFICULTY[plantSpecies.difficulty];

	const handleRowClick = () => {
		onView?.(plantSpecies);
	};

	const handleActionClick = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	const getDifficultyVariant = (): 'default' | 'secondary' | 'destructive' | 'outline' => {
		switch (plantSpecies.difficulty) {
			case 'EASY':
				return 'secondary';
			case 'MEDIUM':
				return 'outline';
			case 'HARD':
				return 'destructive';
			default:
				return 'secondary';
		}
	};

	return (
		<TableRow
			className="cursor-pointer hover:bg-muted/50 transition-colors"
			onClick={handleRowClick}
		>
			<TableCell>
				<div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center text-lg">
					{categoryInfo.icon}
				</div>
			</TableCell>

			<TableCell>
				<div>
					<div className="font-medium">{plantSpecies.commonName}</div>
					<div className="text-sm text-muted-foreground italic">
						{plantSpecies.scientificName}
					</div>
				</div>
			</TableCell>

			<TableCell>
				<Badge variant="secondary" className="text-xs">
					{categoryInfo.icon} {categoryInfo.label}
				</Badge>
			</TableCell>

			<TableCell>
				<Badge variant={getDifficultyVariant()} className="text-xs">
					{difficultyInfo.icon} {difficultyInfo.label}
				</Badge>
			</TableCell>

			<TableCell>
				{plantSpecies.isVerified ? (
					<Badge variant="default" className="text-xs">
						{t('features.plantSpecies.verified')}
					</Badge>
				) : (
					<Badge variant="outline" className="text-xs">
						{t('features.plantSpecies.unverified')}
					</Badge>
				)}
			</TableCell>

			<TableCell onClick={handleActionClick}>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent">
							<MoreVerticalIcon className="h-4 w-4" />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{onView && (
							<DropdownMenuItem onClick={() => onView(plantSpecies)}>
								{t('features.plantSpecies.list.actions.view')}
							</DropdownMenuItem>
						)}
						{onEdit && (
							<DropdownMenuItem onClick={() => onEdit(plantSpecies)}>
								{t('features.plantSpecies.list.actions.edit')}
							</DropdownMenuItem>
						)}
						{onDelete && (
							<DropdownMenuItem
								onClick={() => onDelete(plantSpecies.id)}
								className="text-destructive"
							>
								{t('features.plantSpecies.list.actions.delete.label')}
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	);
}
