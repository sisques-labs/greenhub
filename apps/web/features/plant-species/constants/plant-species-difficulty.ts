import { PlantSpeciesDifficulty } from '@/features/plant-species/api/types/plant-species.types';

export const PLANT_SPECIES_DIFFICULTY: Record<
	PlantSpeciesDifficulty,
	{ label: string; icon: string; description: string }
> = {
	[PlantSpeciesDifficulty.EASY]: {
		label: 'Easy',
		icon: '🟢',
		description: 'Great for beginners',
	},
	[PlantSpeciesDifficulty.MEDIUM]: {
		label: 'Medium',
		icon: '🟡',
		description: 'Some experience needed',
	},
	[PlantSpeciesDifficulty.HARD]: {
		label: 'Hard',
		icon: '🔴',
		description: 'For experienced gardeners',
	},
} as const;
