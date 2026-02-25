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
 * Schema factory for plant species update form validation
 * Following DDD principles, this schema is isolated in its own module
 * Uses enums from SDK to ensure type safety and consistency
 * All fields are optional to support partial updates
 *
 * @param translations - Translation function to get localized error messages
 * @returns Zod schema for plant species update form validation
 */
export function createPlantSpeciesUpdateSchema(
	translations: (key: string) => string,
) {
	return z.object({
		commonName: z
			.string()
			.min(2, translations('shared.validation.commonName.minLength'))
			.max(100, translations('shared.validation.commonName.maxLength'))
			.optional(),
		scientificName: z
			.string()
			.min(2, translations('shared.validation.scientificName.minLength'))
			.max(150, translations('shared.validation.scientificName.maxLength'))
			.optional(),
		family: z
			.string()
			.max(100, translations('shared.validation.family.maxLength'))
			.nullable()
			.optional(),
		description: z
			.string()
			.max(2000, translations('shared.validation.description.maxLength'))
			.nullable()
			.optional(),
		category: z
			.string()
			.refine(
				(value) =>
					Object.values(
						PlantSpeciesCategory as Record<string, string>,
					).includes(value),
				{ message: translations('shared.validation.category.invalid') },
			)
			.optional(),
		difficulty: z
			.string()
			.refine(
				(value) =>
					Object.values(
						PlantSpeciesDifficulty as Record<string, string>,
					).includes(value),
				{ message: translations('shared.validation.difficulty.invalid') },
			)
			.optional(),
		growthRate: z
			.string()
			.refine(
				(value) =>
					Object.values(
						PlantSpeciesGrowthRate as Record<string, string>,
					).includes(value),
				{ message: translations('shared.validation.growthRate.invalid') },
			)
			.optional(),
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
			)
			.optional(),
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
			)
			.optional(),
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
			.nullable()
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
			.nullable()
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
			.nullable()
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
			.nullable()
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
			.nullable()
			.optional(),
		growthTime: z
			.number()
			.positive(translations('shared.validation.growthTime.positive'))
			.nullable()
			.optional(),
		tags: z.array(z.string()).nullable().optional(),
		imageUrl: z
			.string()
			.url(translations('shared.validation.imageUrl.invalid'))
			.nullable()
			.optional(),
	});
}

export type PlantSpeciesUpdateFormValues = z.infer<
	ReturnType<typeof createPlantSpeciesUpdateSchema>
>;
