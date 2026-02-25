'use client';

import type { PlantSpeciesResponse } from '@/features/plant-species/api/types/plant-species-response.types';
import {
	PlantSpeciesCategory,
	PlantSpeciesDifficulty,
	PlantSpeciesGrowthRate,
	PlantSpeciesHumidityRequirements,
	PlantSpeciesLightRequirements,
	PlantSpeciesSoilType,
	PlantSpeciesWaterRequirements,
} from '@/features/plant-species/api/types/plant-species.types';
import { PLANT_SPECIES_CATEGORIES } from '@/features/plant-species/constants/plant-species-categories';
import { PLANT_SPECIES_DIFFICULTY } from '@/features/plant-species/constants/plant-species-difficulty';
import {
	PLANT_SPECIES_LIGHT_REQUIREMENTS,
	PLANT_SPECIES_SOIL_TYPE,
	PLANT_SPECIES_WATER_REQUIREMENTS,
} from '@/features/plant-species/constants/plant-species-requirements';
import type { PlantSpeciesUpdateFormValues } from '@/features/plant-species/schemas/plant-species-update.schema';
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
import {
	Form,
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { XIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePlantSpeciesUpdateForm } from './usePlantSpeciesUpdateForm';

interface PlantSpeciesUpdateFormProps {
	plantSpecies: PlantSpeciesResponse | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (values: PlantSpeciesUpdateFormValues) => Promise<void>;
	isLoading: boolean;
	error: Error | null;
}

export function PlantSpeciesUpdateForm({
	plantSpecies,
	open,
	onOpenChange,
	onSubmit,
	isLoading,
	error,
}: PlantSpeciesUpdateFormProps) {
	const t = useTranslations();

	const {
		commonName,
		scientificName,
		family,
		description,
		category,
		difficulty,
		growthRate,
		lightRequirements,
		waterRequirements,
		humidityRequirements,
		soilType,
		temperatureMin,
		temperatureMax,
		phMin,
		phMax,
		matureSizeHeight,
		matureSizeWidth,
		growthTime,
		tags,
		tagInput,
		formErrors,
		setCommonName,
		setScientificName,
		setFamily,
		setDescription,
		setCategory,
		setDifficulty,
		setGrowthRate,
		setLightRequirements,
		setWaterRequirements,
		setHumidityRequirements,
		setSoilType,
		setTemperatureMin,
		setTemperatureMax,
		setPhMin,
		setPhMax,
		setMatureSizeHeight,
		setMatureSizeWidth,
		setGrowthTime,
		setTagInput,
		addTag,
		removeTag,
		handleSubmit,
		handleOpenChange,
	} = usePlantSpeciesUpdateForm({
		plantSpecies,
		onSubmit,
		onOpenChange,
		error,
		translations: (key: string) => t(key),
	});

	const isVerified = plantSpecies?.isVerified ?? false;

	if (!plantSpecies) {
		return null;
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{t('features.plantSpecies.list.actions.update.title')}
					</DialogTitle>
					<DialogDescription>
						{t('features.plantSpecies.list.actions.update.description')}
					</DialogDescription>
				</DialogHeader>
				<Form errors={formErrors}>
					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Basic Info */}
						<div className="grid grid-cols-2 gap-4">
							<FormItem>
								<FormLabel>{t('shared.fields.commonName.label')}</FormLabel>
								<FormControl>
									<Input
										placeholder={t('shared.fields.commonName.placeholder')}
										disabled={isLoading || isVerified}
										value={commonName}
										onChange={(e) => setCommonName(e.target.value)}
									/>
								</FormControl>
								<FormMessage fieldName="commonName" />
							</FormItem>

							<FormItem>
								<FormLabel>{t('shared.fields.scientificName.label')}</FormLabel>
								<FormControl>
									<Input
										placeholder={t('shared.fields.scientificName.placeholder')}
										disabled={isLoading || isVerified}
										value={scientificName}
										onChange={(e) => setScientificName(e.target.value)}
									/>
								</FormControl>
								<FormMessage fieldName="scientificName" />
							</FormItem>
						</div>

						<FormItem>
							<FormLabel>{t('shared.fields.family.label')}</FormLabel>
							<FormControl>
								<Input
									placeholder={t('shared.fields.family.placeholder')}
									disabled={isLoading}
									value={family || ''}
									onChange={(e) => setFamily(e.target.value || null)}
								/>
							</FormControl>
							<FormMessage fieldName="family" />
						</FormItem>

						<FormItem>
							<FormLabel>{t('shared.fields.description.label')}</FormLabel>
							<FormControl>
								<Textarea
									placeholder={t('shared.fields.description.placeholder')}
									disabled={isLoading}
									value={description || ''}
									onChange={(e) => setDescription(e.target.value || null)}
									rows={3}
								/>
							</FormControl>
							<FormMessage fieldName="description" />
						</FormItem>

						{/* Classification */}
						<div className="grid grid-cols-2 gap-4">
							<FormItem>
								<FormLabel>{t('shared.fields.category.label')}</FormLabel>
								<Select
									onValueChange={setCategory}
									value={category}
									disabled={isLoading}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue
												placeholder={t('shared.fields.category.placeholder')}
											/>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{Object.values(PlantSpeciesCategory).map((cat) => (
											<SelectItem key={cat} value={cat}>
												{PLANT_SPECIES_CATEGORIES[cat].icon}{' '}
												{PLANT_SPECIES_CATEGORIES[cat].label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage fieldName="category" />
							</FormItem>

							<FormItem>
								<FormLabel>{t('shared.fields.difficulty.label')}</FormLabel>
								<Select
									onValueChange={setDifficulty}
									value={difficulty}
									disabled={isLoading}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue
												placeholder={t('shared.fields.difficulty.placeholder')}
											/>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{Object.values(PlantSpeciesDifficulty).map((diff) => (
											<SelectItem key={diff} value={diff}>
												{PLANT_SPECIES_DIFFICULTY[diff].icon}{' '}
												{PLANT_SPECIES_DIFFICULTY[diff].label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage fieldName="difficulty" />
							</FormItem>
						</div>

						<FormItem>
							<FormLabel>{t('shared.fields.growthRate.label')}</FormLabel>
							<Select
								onValueChange={setGrowthRate}
								value={growthRate}
								disabled={isLoading}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue
											placeholder={t('shared.fields.growthRate.placeholder')}
										/>
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{Object.values(PlantSpeciesGrowthRate).map((rate) => (
										<SelectItem key={rate} value={rate}>
											{rate}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage fieldName="growthRate" />
						</FormItem>

						{/* Care Requirements */}
						<div className="grid grid-cols-2 gap-4">
							<FormItem>
								<FormLabel>
									{t('shared.fields.lightRequirements.label')}
								</FormLabel>
								<Select
									onValueChange={setLightRequirements}
									value={lightRequirements}
									disabled={isLoading}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue
												placeholder={t(
													'shared.fields.lightRequirements.placeholder',
												)}
											/>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{Object.values(PlantSpeciesLightRequirements).map((req) => (
											<SelectItem key={req} value={req}>
												{PLANT_SPECIES_LIGHT_REQUIREMENTS[req].icon}{' '}
												{PLANT_SPECIES_LIGHT_REQUIREMENTS[req].label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage fieldName="lightRequirements" />
							</FormItem>

							<FormItem>
								<FormLabel>
									{t('shared.fields.waterRequirements.label')}
								</FormLabel>
								<Select
									onValueChange={setWaterRequirements}
									value={waterRequirements}
									disabled={isLoading}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue
												placeholder={t(
													'shared.fields.waterRequirements.placeholder',
												)}
											/>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{Object.values(PlantSpeciesWaterRequirements).map((req) => (
											<SelectItem key={req} value={req}>
												{PLANT_SPECIES_WATER_REQUIREMENTS[req].icon}{' '}
												{PLANT_SPECIES_WATER_REQUIREMENTS[req].label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage fieldName="waterRequirements" />
							</FormItem>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<FormItem>
								<FormLabel>
									{t('shared.fields.humidityRequirements.label')}
								</FormLabel>
								<Select
									onValueChange={(v) =>
										setHumidityRequirements(v === 'none' ? null : v)
									}
									value={humidityRequirements || 'none'}
									disabled={isLoading}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue
												placeholder={t(
													'shared.fields.humidityRequirements.placeholder',
												)}
											/>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="none">{t('common.none')}</SelectItem>
										{Object.values(PlantSpeciesHumidityRequirements).map(
											(req) => (
												<SelectItem key={req} value={req}>
													{req}
												</SelectItem>
											),
										)}
									</SelectContent>
								</Select>
								<FormMessage fieldName="humidityRequirements" />
							</FormItem>

							<FormItem>
								<FormLabel>{t('shared.fields.soilType.label')}</FormLabel>
								<Select
									onValueChange={(v) => setSoilType(v === 'none' ? null : v)}
									value={soilType || 'none'}
									disabled={isLoading}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue
												placeholder={t('shared.fields.soilType.placeholder')}
											/>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="none">{t('common.none')}</SelectItem>
										{Object.values(PlantSpeciesSoilType).map((type) => (
											<SelectItem key={type} value={type}>
												{PLANT_SPECIES_SOIL_TYPE[type].icon}{' '}
												{PLANT_SPECIES_SOIL_TYPE[type].label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage fieldName="soilType" />
							</FormItem>
						</div>

						{/* Temperature Range */}
						<div className="grid grid-cols-2 gap-4">
							<FormItem>
								<FormLabel>
									{t('shared.fields.temperatureRange.min.label')}
								</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder={t(
											'shared.fields.temperatureRange.min.placeholder',
										)}
										disabled={isLoading}
										value={temperatureMin}
										onChange={(e) => setTemperatureMin(e.target.value)}
									/>
								</FormControl>
								<FormMessage fieldName="temperatureRange" />
							</FormItem>

							<FormItem>
								<FormLabel>
									{t('shared.fields.temperatureRange.max.label')}
								</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder={t(
											'shared.fields.temperatureRange.max.placeholder',
										)}
										disabled={isLoading}
										value={temperatureMax}
										onChange={(e) => setTemperatureMax(e.target.value)}
									/>
								</FormControl>
							</FormItem>
						</div>

						{/* pH Range */}
						<div className="grid grid-cols-2 gap-4">
							<FormItem>
								<FormLabel>{t('shared.fields.phRange.min.label')}</FormLabel>
								<FormControl>
									<Input
										type="number"
										step="0.1"
										placeholder={t('shared.fields.phRange.min.placeholder')}
										disabled={isLoading}
										value={phMin}
										onChange={(e) => setPhMin(e.target.value)}
									/>
								</FormControl>
								<FormMessage fieldName="phRange" />
							</FormItem>

							<FormItem>
								<FormLabel>{t('shared.fields.phRange.max.label')}</FormLabel>
								<FormControl>
									<Input
										type="number"
										step="0.1"
										placeholder={t('shared.fields.phRange.max.placeholder')}
										disabled={isLoading}
										value={phMax}
										onChange={(e) => setPhMax(e.target.value)}
									/>
								</FormControl>
							</FormItem>
						</div>

						{/* Mature Size */}
						<div className="grid grid-cols-2 gap-4">
							<FormItem>
								<FormLabel>
									{t('shared.fields.matureSize.height.label')}
								</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder={t(
											'shared.fields.matureSize.height.placeholder',
										)}
										disabled={isLoading}
										value={matureSizeHeight}
										onChange={(e) => setMatureSizeHeight(e.target.value)}
									/>
								</FormControl>
								<FormMessage fieldName="matureSize" />
							</FormItem>

							<FormItem>
								<FormLabel>
									{t('shared.fields.matureSize.width.label')}
								</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder={t('shared.fields.matureSize.width.placeholder')}
										disabled={isLoading}
										value={matureSizeWidth}
										onChange={(e) => setMatureSizeWidth(e.target.value)}
									/>
								</FormControl>
							</FormItem>
						</div>

						{/* Growth Time */}
						<FormItem>
							<FormLabel>{t('shared.fields.growthTime.label')}</FormLabel>
							<FormControl>
								<Input
									type="number"
									placeholder={t('shared.fields.growthTime.placeholder')}
									disabled={isLoading}
									value={growthTime}
									onChange={(e) => setGrowthTime(e.target.value)}
								/>
							</FormControl>
							<FormMessage fieldName="growthTime" />
						</FormItem>

						{/* Tags */}
						<FormItem>
							<FormLabel>{t('shared.fields.tags.label')}</FormLabel>
							<div className="flex gap-2">
								<FormControl>
									<Input
										placeholder={t('shared.fields.tags.placeholder')}
										disabled={isLoading}
										value={tagInput}
										onChange={(e) => setTagInput(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === 'Enter') {
												e.preventDefault();
												addTag();
											}
										}}
									/>
								</FormControl>
								<Button
									type="button"
									variant="outline"
									onClick={addTag}
									disabled={isLoading || !tagInput.trim()}
								>
									{t('common.add')}
								</Button>
							</div>
							{tags.length > 0 && (
								<div className="flex flex-wrap gap-2 mt-2">
									{tags.map((tag) => (
										<Badge key={tag} variant="secondary" className="gap-1">
											{tag}
											<button
												type="button"
												onClick={() => removeTag(tag)}
												className="ml-1 hover:text-destructive"
											>
												<XIcon className="h-3 w-3" />
											</button>
										</Badge>
									))}
								</div>
							)}
							<FormMessage fieldName="tags" />
						</FormItem>

						{error && (
							<div className="text-sm text-destructive">{error.message}</div>
						)}

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => handleOpenChange(false)}
								disabled={isLoading}
							>
								{t('common.cancel')}
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading
									? t('features.plantSpecies.list.actions.update.loading')
									: t('features.plantSpecies.list.actions.update.submit')}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
