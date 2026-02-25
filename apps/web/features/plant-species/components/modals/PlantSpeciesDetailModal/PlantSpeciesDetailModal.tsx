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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/shared/components/ui/dialog';
import { Separator } from '@/shared/components/ui/separator';
import { useTranslations } from 'next-intl';

interface PlantSpeciesDetailModalProps {
	plantSpecies: PlantSpeciesResponse | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onEdit?: (plantSpecies: PlantSpeciesResponse) => void;
}

export function PlantSpeciesDetailModal({
	plantSpecies,
	open,
	onOpenChange,
	onEdit,
}: PlantSpeciesDetailModalProps) {
	const t = useTranslations();

	if (!plantSpecies) {
		return null;
	}

	const categoryInfo = PLANT_SPECIES_CATEGORIES[plantSpecies.category];
	const difficultyInfo = PLANT_SPECIES_DIFFICULTY[plantSpecies.difficulty];
	const lightInfo = PLANT_SPECIES_LIGHT_REQUIREMENTS[plantSpecies.lightRequirements];
	const waterInfo = PLANT_SPECIES_WATER_REQUIREMENTS[plantSpecies.waterRequirements];

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<div className="flex items-start justify-between gap-4">
						<div>
							<DialogTitle className="text-xl">
								{plantSpecies.commonName}
							</DialogTitle>
							<DialogDescription className="italic mt-1">
								{plantSpecies.scientificName}
							</DialogDescription>
						</div>
						<div className="flex gap-2 shrink-0">
							<Badge variant="secondary">
								{categoryInfo.icon} {categoryInfo.label}
							</Badge>
							{plantSpecies.isVerified && (
								<Badge variant="default">
									{t('features.plantSpecies.verified')}
								</Badge>
							)}
						</div>
					</div>
				</DialogHeader>

				<div className="space-y-4">
					{/* Description */}
					{plantSpecies.description && (
						<div>
							<p className="text-sm text-muted-foreground">
								{plantSpecies.description}
							</p>
						</div>
					)}

					{plantSpecies.family && (
						<div className="text-sm">
							<span className="font-medium">{t('shared.fields.family.label')}: </span>
							<span className="text-muted-foreground">{plantSpecies.family}</span>
						</div>
					)}

					<Separator />

					{/* Care Overview */}
					<div>
						<h4 className="text-sm font-semibold mb-3">
							{t('features.plantSpecies.sections.careOverview')}
						</h4>
						<div className="grid grid-cols-2 gap-3">
							<div className="flex items-center gap-2 text-sm">
								<span className="text-lg">{difficultyInfo.icon}</span>
								<div>
									<div className="font-medium">{t('shared.fields.difficulty.label')}</div>
									<div className="text-muted-foreground">{difficultyInfo.label}</div>
								</div>
							</div>

							<div className="flex items-center gap-2 text-sm">
								<span className="text-lg">{lightInfo.icon}</span>
								<div>
									<div className="font-medium">{t('shared.fields.lightRequirements.label')}</div>
									<div className="text-muted-foreground">{lightInfo.label}</div>
								</div>
							</div>

							<div className="flex items-center gap-2 text-sm">
								<span className="text-lg">{waterInfo.icon}</span>
								<div>
									<div className="font-medium">{t('shared.fields.waterRequirements.label')}</div>
									<div className="text-muted-foreground">{waterInfo.label}</div>
								</div>
							</div>

							{plantSpecies.humidityRequirements && (
								<div className="flex items-center gap-2 text-sm">
									<span className="text-lg">💨</span>
									<div>
										<div className="font-medium">{t('shared.fields.humidityRequirements.label')}</div>
										<div className="text-muted-foreground">
											{plantSpecies.humidityRequirements}
										</div>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Growth Info */}
					<Separator />
					<div>
						<h4 className="text-sm font-semibold mb-3">
							{t('features.plantSpecies.sections.growthInfo')}
						</h4>
						<div className="grid grid-cols-2 gap-3 text-sm">
							<div>
								<div className="font-medium">{t('shared.fields.growthRate.label')}</div>
								<div className="text-muted-foreground">
									{plantSpecies.growthRate}
								</div>
							</div>

							{plantSpecies.growthTime && (
								<div>
									<div className="font-medium">{t('shared.fields.growthTime.label')}</div>
									<div className="text-muted-foreground">
										{formatGrowthTime(plantSpecies.growthTime)}
									</div>
								</div>
							)}

							{plantSpecies.matureSize && (
								<div>
									<div className="font-medium">{t('shared.fields.matureSize.label')}</div>
									<div className="text-muted-foreground">
										{formatMatureSize(plantSpecies.matureSize)}
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Environmental Conditions */}
					{(plantSpecies.temperatureRange ||
						plantSpecies.phRange ||
						plantSpecies.soilType) && (
						<>
							<Separator />
							<div>
								<h4 className="text-sm font-semibold mb-3">
									{t('features.plantSpecies.sections.environmentalConditions')}
								</h4>
								<div className="grid grid-cols-2 gap-3 text-sm">
									{plantSpecies.temperatureRange && (
										<div>
											<div className="font-medium">
												{t('shared.fields.temperatureRange.label')}
											</div>
											<div className="text-muted-foreground">
												{formatTemperatureRange(plantSpecies.temperatureRange)}
											</div>
										</div>
									)}

									{plantSpecies.phRange && (
										<div>
											<div className="font-medium">{t('shared.fields.phRange.label')}</div>
											<div className="text-muted-foreground">
												{formatPhRange(plantSpecies.phRange)}
											</div>
										</div>
									)}

									{plantSpecies.soilType && (
										<div>
											<div className="font-medium">{t('shared.fields.soilType.label')}</div>
											<div className="text-muted-foreground">
												{PLANT_SPECIES_SOIL_TYPE[plantSpecies.soilType].icon}{' '}
												{PLANT_SPECIES_SOIL_TYPE[plantSpecies.soilType].label}
											</div>
										</div>
									)}
								</div>
							</div>
						</>
					)}

					{/* Tags */}
					{plantSpecies.tags && plantSpecies.tags.length > 0 && (
						<>
							<Separator />
							<div>
								<h4 className="text-sm font-semibold mb-2">
									{t('shared.fields.tags.label')}
								</h4>
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
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						{t('common.close')}
					</Button>
					{onEdit && (
						<Button onClick={() => onEdit(plantSpecies)}>
							{t('common.edit')}
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
