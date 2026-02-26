'use client';

import type { PlantSpeciesResponse } from '@/features/plant-species/api/types/plant-species-response.types';
import { PLANT_SPECIES_CATEGORIES } from '@/features/plant-species/constants/plant-species-categories';
import { PLANT_SPECIES_DIFFICULTY } from '@/features/plant-species/constants/plant-species-difficulty';
import {
	PLANT_SPECIES_LIGHT_REQUIREMENTS,
	PLANT_SPECIES_SOIL_TYPE,
	PLANT_SPECIES_WATER_REQUIREMENTS,
} from '@/features/plant-species/constants/plant-species-requirements';
import {
	formatGrowthTime,
	formatMatureSize,
	formatPhRange,
	formatTemperatureRange,
} from '@/features/plant-species/utils/plant-species-formatters';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useTranslations } from 'next-intl';

interface PlantSpeciesDetailCardProps {
	plantSpecies: PlantSpeciesResponse;
	onEdit?: (plantSpecies: PlantSpeciesResponse) => void;
	onDelete?: (id: string) => void;
}

export function PlantSpeciesDetailCard({
	plantSpecies,
	onEdit,
	onDelete,
}: PlantSpeciesDetailCardProps) {
	const t = useTranslations();

	const categoryInfo = PLANT_SPECIES_CATEGORIES[plantSpecies.category];
	const difficultyInfo = PLANT_SPECIES_DIFFICULTY[plantSpecies.difficulty];
	const lightInfo = PLANT_SPECIES_LIGHT_REQUIREMENTS[plantSpecies.lightRequirements];
	const waterInfo = PLANT_SPECIES_WATER_REQUIREMENTS[plantSpecies.waterRequirements];

	return (
		<Card className="w-full">
			<CardHeader>
				<div className="flex items-start justify-between gap-4">
					<div className="flex items-center gap-4">
						<div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center text-4xl shrink-0">
							{categoryInfo.icon}
						</div>
						<div>
							<CardTitle className="text-2xl">{plantSpecies.commonName}</CardTitle>
							<CardDescription className="italic text-base mt-0.5">
								{plantSpecies.scientificName}
							</CardDescription>
							{plantSpecies.family && (
								<p className="text-sm text-muted-foreground mt-1">
									{t('shared.fields.family.label')}: {plantSpecies.family}
								</p>
							)}
						</div>
					</div>
					<div className="flex flex-col gap-2 items-end shrink-0">
						<Badge variant="secondary">
							{categoryInfo.icon} {categoryInfo.label}
						</Badge>
						{plantSpecies.isVerified && (
							<Badge variant="default">
								{t('features.plantSpecies.verified')}
							</Badge>
						)}
						<div className="flex gap-2 mt-2">
							{onEdit && (
								<Button
									variant="outline"
									size="sm"
									onClick={() => onEdit(plantSpecies)}
								>
									{t('common.edit')}
								</Button>
							)}
							{onDelete && (
								<Button
									variant="destructive"
									size="sm"
									onClick={() => onDelete(plantSpecies.id)}
								>
									{t('common.delete')}
								</Button>
							)}
						</div>
					</div>
				</div>

				{plantSpecies.description && (
					<p className="text-sm text-muted-foreground mt-4">
						{plantSpecies.description}
					</p>
				)}
			</CardHeader>

			<CardContent>
				<Tabs defaultValue="care">
					<TabsList className="mb-4">
						<TabsTrigger value="care">
							{t('features.plantSpecies.tabs.care')}
						</TabsTrigger>
						<TabsTrigger value="growth">
							{t('features.plantSpecies.tabs.growth')}
						</TabsTrigger>
						<TabsTrigger value="environment">
							{t('features.plantSpecies.tabs.environment')}
						</TabsTrigger>
					</TabsList>

					{/* Care Tab */}
					<TabsContent value="care" className="space-y-4">
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
							<div className="p-3 rounded-lg border space-y-1">
								<div className="text-xs text-muted-foreground">
									{t('shared.fields.difficulty.label')}
								</div>
								<div className="font-medium flex items-center gap-1">
									<span>{difficultyInfo.icon}</span>
									<span>{difficultyInfo.label}</span>
								</div>
								<div className="text-xs text-muted-foreground">
									{difficultyInfo.description}
								</div>
							</div>

							<div className="p-3 rounded-lg border space-y-1">
								<div className="text-xs text-muted-foreground">
									{t('shared.fields.lightRequirements.label')}
								</div>
								<div className="font-medium flex items-center gap-1">
									<span>{lightInfo.icon}</span>
									<span>{lightInfo.label}</span>
								</div>
								<div className="text-xs text-muted-foreground">
									{lightInfo.description}
								</div>
							</div>

							<div className="p-3 rounded-lg border space-y-1">
								<div className="text-xs text-muted-foreground">
									{t('shared.fields.waterRequirements.label')}
								</div>
								<div className="font-medium flex items-center gap-1">
									<span>{waterInfo.icon}</span>
									<span>{waterInfo.label}</span>
								</div>
								<div className="text-xs text-muted-foreground">
									{waterInfo.description}
								</div>
							</div>

							{plantSpecies.humidityRequirements && (
								<div className="p-3 rounded-lg border space-y-1">
									<div className="text-xs text-muted-foreground">
										{t('shared.fields.humidityRequirements.label')}
									</div>
									<div className="font-medium flex items-center gap-1">
										<span>💨</span>
										<span>{plantSpecies.humidityRequirements}</span>
									</div>
								</div>
							)}

							{plantSpecies.soilType && (
								<div className="p-3 rounded-lg border space-y-1">
									<div className="text-xs text-muted-foreground">
										{t('shared.fields.soilType.label')}
									</div>
									<div className="font-medium flex items-center gap-1">
										<span>{PLANT_SPECIES_SOIL_TYPE[plantSpecies.soilType].icon}</span>
										<span>{PLANT_SPECIES_SOIL_TYPE[plantSpecies.soilType].label}</span>
									</div>
									<div className="text-xs text-muted-foreground">
										{PLANT_SPECIES_SOIL_TYPE[plantSpecies.soilType].description}
									</div>
								</div>
							)}
						</div>
					</TabsContent>

					{/* Growth Tab */}
					<TabsContent value="growth" className="space-y-4">
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
							<div className="p-3 rounded-lg border space-y-1">
								<div className="text-xs text-muted-foreground">
									{t('shared.fields.growthRate.label')}
								</div>
								<div className="font-medium">{plantSpecies.growthRate}</div>
							</div>

							{plantSpecies.growthTime && (
								<div className="p-3 rounded-lg border space-y-1">
									<div className="text-xs text-muted-foreground">
										{t('shared.fields.growthTime.label')}
									</div>
									<div className="font-medium">
										{formatGrowthTime(plantSpecies.growthTime)}
									</div>
								</div>
							)}

							{plantSpecies.matureSize && (
								<div className="p-3 rounded-lg border space-y-1">
									<div className="text-xs text-muted-foreground">
										{t('shared.fields.matureSize.label')}
									</div>
									<div className="font-medium">
										{formatMatureSize(plantSpecies.matureSize)}
									</div>
								</div>
							)}
						</div>
					</TabsContent>

					{/* Environment Tab */}
					<TabsContent value="environment" className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							{plantSpecies.temperatureRange && (
								<div className="p-3 rounded-lg border space-y-1">
									<div className="text-xs text-muted-foreground">
										{t('shared.fields.temperatureRange.label')}
									</div>
									<div className="font-medium">
										{formatTemperatureRange(plantSpecies.temperatureRange)}
									</div>
								</div>
							)}

							{plantSpecies.phRange && (
								<div className="p-3 rounded-lg border space-y-1">
									<div className="text-xs text-muted-foreground">
										{t('shared.fields.phRange.label')}
									</div>
									<div className="font-medium">
										{formatPhRange(plantSpecies.phRange)}
									</div>
								</div>
							)}
						</div>

						{(!plantSpecies.temperatureRange && !plantSpecies.phRange) && (
							<div className="text-sm text-muted-foreground text-center py-4">
								{t('features.plantSpecies.noEnvironmentalData')}
							</div>
						)}
					</TabsContent>
				</Tabs>

				{/* Tags */}
				{plantSpecies.tags && plantSpecies.tags.length > 0 && (
					<>
						<Separator className="my-4" />
						<div>
							<div className="text-sm font-medium mb-2">
								{t('shared.fields.tags.label')}
							</div>
							<div className="flex flex-wrap gap-2">
								{plantSpecies.tags.map((tag) => (
									<Badge key={tag} variant="outline">
										{tag}
									</Badge>
								))}
							</div>
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
}
