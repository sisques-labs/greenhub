import { PlantPrimitives } from '@/core/plant-context/domain/primitives/plant.primitives';

export type GrowingUnitPrimitives = {
	id: string;
	name: string;
	type: string;
	capacity: number;
	dimensions: {
		length: number;
		width: number;
		height: number;
		unit: string;
	} | null;
	plants: PlantPrimitives[];
};
