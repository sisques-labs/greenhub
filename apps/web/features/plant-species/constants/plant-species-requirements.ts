import {
	PlantSpeciesLightRequirements,
	PlantSpeciesWaterRequirements,
	PlantSpeciesSoilType,
} from '../api/types/plant-species.types';

export const PLANT_SPECIES_LIGHT_REQUIREMENTS: Record<
	PlantSpeciesLightRequirements,
	{ label: string; icon: string; description: string }
> = {
	[PlantSpeciesLightRequirements.FULL_SUN]: {
		label: 'Full Sun',
		icon: '☀️',
		description: '6+ hours direct sunlight',
	},
	[PlantSpeciesLightRequirements.PARTIAL_SUN]: {
		label: 'Partial Sun',
		icon: '⛅',
		description: '4-6 hours direct sunlight',
	},
	[PlantSpeciesLightRequirements.PARTIAL_SHADE]: {
		label: 'Partial Shade',
		icon: '🌤️',
		description: '2-4 hours direct sunlight',
	},
	[PlantSpeciesLightRequirements.FULL_SHADE]: {
		label: 'Full Shade',
		icon: '☁️',
		description: 'No direct sunlight',
	},
} as const;

export const PLANT_SPECIES_WATER_REQUIREMENTS: Record<
	PlantSpeciesWaterRequirements,
	{ label: string; icon: string; description: string }
> = {
	[PlantSpeciesWaterRequirements.LOW]: {
		label: 'Low',
		icon: '💧',
		description: 'Water sparingly, drought tolerant',
	},
	[PlantSpeciesWaterRequirements.MEDIUM]: {
		label: 'Medium',
		icon: '💧💧',
		description: 'Regular watering required',
	},
	[PlantSpeciesWaterRequirements.HIGH]: {
		label: 'High',
		icon: '💧💧💧',
		description: 'Frequent watering needed',
	},
} as const;

export const PLANT_SPECIES_SOIL_TYPE: Record<
	PlantSpeciesSoilType,
	{ label: string; icon: string; description: string }
> = {
	[PlantSpeciesSoilType.SANDY]: {
		label: 'Sandy',
		icon: '🏖️',
		description: 'Fast-draining, low nutrients',
	},
	[PlantSpeciesSoilType.LOAMY]: {
		label: 'Loamy',
		icon: '🌱',
		description: 'Well-balanced, ideal for most plants',
	},
	[PlantSpeciesSoilType.CLAY]: {
		label: 'Clay',
		icon: '🏔️',
		description: 'Dense, slow-draining, nutrient-rich',
	},
	[PlantSpeciesSoilType.PEATY]: {
		label: 'Peaty',
		icon: '🍂',
		description: 'Acidic, high moisture retention',
	},
	[PlantSpeciesSoilType.CHALKY]: {
		label: 'Chalky',
		icon: '🪨',
		description: 'Alkaline, free-draining',
	},
} as const;
