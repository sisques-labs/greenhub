'use client';

import type { PlantSpeciesResponse } from '@/features/plant-species/api/types/plant-species-response.types';
import { PLANT_SPECIES_CATEGORIES } from '@/features/plant-species/constants/plant-species-categories';
import { PLANT_SPECIES_DIFFICULTY } from '@/features/plant-species/constants/plant-species-difficulty';
import { PLANT_SPECIES_LIGHT_REQUIREMENTS } from '@/features/plant-species/constants/plant-species-requirements';
import { Badge } from '@/shared/components/ui/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { MoreVerticalIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PlantSpeciesCardProps {
	plantSpecies: PlantSpeciesResponse;
	onView?: (plantSpecies: PlantSpeciesResponse) => void;
	onEdit?: (plantSpecies: PlantSpeciesResponse) => void;
	onDelete?: (id: string) => void;
}

export function PlantSpeciesCard({
	plantSpecies,
	onView,
	onEdit,
	onDelete,
}: PlantSpeciesCardProps) {
	const t = useTranslations();

	const categoryInfo = PLANT_SPECIES_CATEGORIES[plantSpecies.category];
	const difficultyInfo = PLANT_SPECIES_DIFFICULTY[plantSpecies.difficulty];
	const lightInfo = PLANT_SPECIES_LIGHT_REQUIREMENTS[plantSpecies.lightRequirements];

	const handleActionClick = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	const handleEdit = (e: React.MouseEvent) => {
		e.stopPropagation();
		onEdit?.(plantSpecies);
	};

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		onDelete?.(plantSpecies.id);
	};

	const handleCardClick = () => {
		onView?.(plantSpecies);
	};

	return (
		<Card
			className="hover:shadow-lg transition-shadow overflow-hidden pt-0! cursor-pointer"
			onClick={handleCardClick}
		>
			<CardHeader className="p-0! m-0!">
				{/* Image area with badge and menu */}
				<div className="relative w-full h-48 bg-muted">
					<div className="w-full h-full flex items-center justify-center text-5xl">
						{categoryInfo.icon}
					</div>

					{/* Category badge - top-left */}
					<div className="absolute top-2 left-2">
						<Badge variant="secondary" className="text-xs">
							{categoryInfo.label}
						</Badge>
					</div>

					{/* Verified badge - top-left below category */}
					{plantSpecies.isVerified && (
						<div className="absolute top-8 left-2 mt-1">
							<Badge variant="default" className="text-xs">
								{t('features.plantSpecies.verified')}
							</Badge>
						</div>
					)}

					{/* Actions menu - top-right */}
					{(onEdit || onDelete) && (
						<div className="absolute top-2 right-2" onClick={handleActionClick}>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<button className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent bg-background/80 backdrop-blur-sm">
										<MoreVerticalIcon className="h-4 w-4" />
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									{onView && (
										<DropdownMenuItem
											onClick={(e) => {
												e.stopPropagation();
												onView(plantSpecies);
											}}
										>
											{t('features.plantSpecies.list.actions.view')}
										</DropdownMenuItem>
									)}
									{onEdit && (
										<DropdownMenuItem onClick={handleEdit}>
											{t('features.plantSpecies.list.actions.edit')}
										</DropdownMenuItem>
									)}
									{onDelete && (
										<DropdownMenuItem
											onClick={handleDelete}
											className="text-destructive"
										>
											{t('features.plantSpecies.list.actions.delete.label')}
										</DropdownMenuItem>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					)}
				</div>

				<div className="p-4 space-y-1">
					<CardTitle className="text-base font-bold leading-tight">
						{plantSpecies.commonName}
					</CardTitle>
					<CardDescription className="text-xs italic">
						{plantSpecies.scientificName}
					</CardDescription>
				</div>
			</CardHeader>

			<CardContent className="pt-0 px-4 pb-4">
				<div className="flex items-center justify-between text-xs text-muted-foreground">
					<span>
						{difficultyInfo.icon} {difficultyInfo.label}
					</span>
					<span>
						{lightInfo.icon} {lightInfo.label}
					</span>
				</div>

				{plantSpecies.tags && plantSpecies.tags.length > 0 && (
					<div className="flex flex-wrap gap-1 mt-2">
						{plantSpecies.tags.slice(0, 3).map((tag) => (
							<Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">
								{tag}
							</Badge>
						))}
						{plantSpecies.tags.length > 3 && (
							<Badge variant="outline" className="text-xs px-1.5 py-0">
								+{plantSpecies.tags.length - 3}
							</Badge>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
