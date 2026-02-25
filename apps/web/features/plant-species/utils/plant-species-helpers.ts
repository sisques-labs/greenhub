import { PlantSpeciesCategory, PlantSpeciesDifficulty } from '../api/types/plant-species.types';
import { PLANT_SPECIES_CATEGORIES } from '../constants/plant-species-categories';
import { PLANT_SPECIES_DIFFICULTY } from '../constants/plant-species-difficulty';

export function getCategoryIcon(category: PlantSpeciesCategory): string {
	return PLANT_SPECIES_CATEGORIES[category]?.icon ?? '🌱';
}

export function getCategoryLabel(category: PlantSpeciesCategory): string {
	return PLANT_SPECIES_CATEGORIES[category]?.label ?? category;
}

export function getCategoryColor(category: PlantSpeciesCategory): string {
	return PLANT_SPECIES_CATEGORIES[category]?.color ?? 'gray';
}

export function getDifficultyColor(difficulty: PlantSpeciesDifficulty): string {
	const colors: Record<PlantSpeciesDifficulty, string> = {
		[PlantSpeciesDifficulty.EASY]: 'green',
		[PlantSpeciesDifficulty.MEDIUM]: 'yellow',
		[PlantSpeciesDifficulty.HARD]: 'red',
	};
	return colors[difficulty] ?? 'gray';
}

export function getDifficultyLabel(difficulty: PlantSpeciesDifficulty): string {
	return PLANT_SPECIES_DIFFICULTY[difficulty]?.label ?? difficulty;
}

export function getDifficultyIcon(difficulty: PlantSpeciesDifficulty): string {
	return PLANT_SPECIES_DIFFICULTY[difficulty]?.icon ?? '';
}
