import { PlantSpeciesCategory } from '@/features/plant-species/api/types/plant-species.types';

export const PLANT_SPECIES_CATEGORIES: Record<
	PlantSpeciesCategory,
	{ label: string; icon: string; color: string }
> = {
	[PlantSpeciesCategory.VEGETABLE]: {
		label: 'Vegetable',
		icon: '🥕',
		color: 'green',
	},
	[PlantSpeciesCategory.FRUIT]: { label: 'Fruit', icon: '🍎', color: 'red' },
	[PlantSpeciesCategory.HERB]: { label: 'Herb', icon: '🌿', color: 'green' },
	[PlantSpeciesCategory.FLOWER]: { label: 'Flower', icon: '🌸', color: 'pink' },
	[PlantSpeciesCategory.TREE]: { label: 'Tree', icon: '🌳', color: 'brown' },
	[PlantSpeciesCategory.SHRUB]: { label: 'Shrub', icon: '🌳', color: 'green' },
	[PlantSpeciesCategory.SUCCULENT]: {
		label: 'Succulent',
		icon: '🌵',
		color: 'teal',
	},
	[PlantSpeciesCategory.FERN]: { label: 'Fern', icon: '🌿', color: 'green' },
	[PlantSpeciesCategory.GRASS]: { label: 'Grass', icon: '🌾', color: 'green' },
	[PlantSpeciesCategory.OTHER]: { label: 'Other', icon: '🌱', color: 'gray' },
} as const;
