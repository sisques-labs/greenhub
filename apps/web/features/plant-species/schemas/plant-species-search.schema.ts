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
 * Schema factory for plant species search/filter form validation
 * Following DDD principles, this schema is isolated in its own module
 * Uses enums from SDK to ensure type safety and consistency
 * All fields are optional to allow partial filtering
 *
 * @param translations - Translation function to get localized error messages
 * @returns Zod schema for plant species search form validation
 */
export function createPlantSpeciesSearchSchema(
	translations: (key: string) => string,
) {
	return z.object({
		search: z.string().optional(),
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
		tags: z.array(z.string()).optional(),
		page: z
			.number()
			.int(translations('shared.validation.page.integer'))
			.positive(translations('shared.validation.page.positive'))
			.optional(),
		perPage: z
			.number()
			.int(translations('shared.validation.perPage.integer'))
			.positive(translations('shared.validation.perPage.positive'))
			.optional(),
	});
}

export type PlantSpeciesSearchFormValues = z.infer<
	ReturnType<typeof createPlantSpeciesSearchSchema>
>;
