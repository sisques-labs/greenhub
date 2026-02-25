import {
	PlantSpeciesCategory,
	PlantSpeciesDifficulty,
	PlantSpeciesGrowthRate,
	PlantSpeciesHumidityRequirements,
	PlantSpeciesLightRequirements,
	PlantSpeciesSoilType,
	PlantSpeciesWaterRequirements,
} from '@/features/plant-species/api/types/plant-species.types';
import { z } from 'zod';

/**
 * Schema factory for plant species create form validation
 * Following DDD principles, this schema is isolated in its own module
 * Uses enums from SDK to ensure type safety and consistency
 *
 * @param translations - Translation function to get localized error messages
 * @returns Zod schema for plant species create form validation
 */
export function createPlantSpeciesCreateSchema(
	translations: (key: string) => string,
) {
	return z.object({
		commonName: z
			.string()
			.min(2, translations('shared.validation.commonName.minLength'))
			.max(100, translations('shared.validation.commonName.maxLength')),
		scientificName: z
			.string()
			.min(2, translations('shared.validation.scientificName.minLength'))
			.max(150, translations('shared.validation.scientificName.maxLength')),
		family: z
			.string()
			.max(100, translations('shared.validation.family.maxLength'))
			.optional(),
		description: z
			.string()
			.max(2000, translations('shared.validation.description.maxLength'))
			.optional(),
		category: z
			.string()
			.refine(
				(value) =>
					Object.values(
						PlantSpeciesCategory as Record<string, string>,
					).includes(value),
				{ message: translations('shared.validation.category.invalid') },
			),
		difficulty: z
			.string()
			.refine(
				(value) =>
					Object.values(
						PlantSpeciesDifficulty as Record<string, string>,
					).includes(value),
				{ message: translations('shared.validation.difficulty.invalid') },
			),
		growthRate: z
			.string()
			.refine(
				(value) =>
					Object.values(
						PlantSpeciesGrowthRate as Record<string, string>,
					).includes(value),
				{ message: translations('shared.validation.growthRate.invalid') },
			),
		lightRequirements: z
			.string()
			.refine(
				(value) =>
					Object.values(
						PlantSpeciesLightRequirements as Record<string, string>,
					).includes(value),
				{
					message: translations('shared.validation.lightRequirements.invalid'),
				},
			),
		waterRequirements: z
			.string()
			.refine(
				(value) =>
					Object.values(
						PlantSpeciesWaterRequirements as Record<string, string>,
					).includes(value),
				{
					message: translations('shared.validation.waterRequirements.invalid'),
				},
			),
		temperatureRange: z
			.object({
				min: z
					.number()
					.min(
						-20,
						translations('shared.validation.temperatureRange.min.minValue'),
					)
					.max(
						50,
						translations('shared.validation.temperatureRange.min.maxValue'),
					),
				max: z
					.number()
					.min(
						-20,
						translations('shared.validation.temperatureRange.max.minValue'),
					)
					.max(
						50,
						translations('shared.validation.temperatureRange.max.maxValue'),
					),
			})
			.refine((data) => data.min < data.max, {
				message: translations(
					'shared.validation.temperatureRange.minLessThanMax',
				),
			})
			.optional(),
		humidityRequirements: z
			.string()
			.refine(
				(value) =>
					Object.values(
						PlantSpeciesHumidityRequirements as Record<string, string>,
					).includes(value),
				{
					message: translations(
						'shared.validation.humidityRequirements.invalid',
					),
				},
			)
			.optional(),
		soilType: z
			.string()
			.refine(
				(value) =>
					Object.values(
						PlantSpeciesSoilType as Record<string, string>,
					).includes(value),
				{ message: translations('shared.validation.soilType.invalid') },
			)
			.optional(),
		phRange: z
			.object({
				min: z
					.number()
					.min(0, translations('shared.validation.phRange.min.minValue'))
					.max(14, translations('shared.validation.phRange.min.maxValue')),
				max: z
					.number()
					.min(0, translations('shared.validation.phRange.max.minValue'))
					.max(14, translations('shared.validation.phRange.max.maxValue')),
			})
			.refine((data) => data.min < data.max, {
				message: translations('shared.validation.phRange.minLessThanMax'),
			})
			.optional(),
		matureSize: z
			.object({
				height: z
					.number()
					.positive(
						translations('shared.validation.matureSize.height.positive'),
					),
				width: z
					.number()
					.positive(
						translations('shared.validation.matureSize.width.positive'),
					),
			})
			.optional(),
		growthTime: z
			.number()
			.positive(translations('shared.validation.growthTime.positive'))
			.optional(),
		tags: z.array(z.string()).optional(),
		imageUrl: z
			.string()
			.url(translations('shared.validation.imageUrl.invalid'))
			.optional(),
	});
}

export type PlantSpeciesCreateFormValues = z.infer<
	ReturnType<typeof createPlantSpeciesCreateSchema>
>;
