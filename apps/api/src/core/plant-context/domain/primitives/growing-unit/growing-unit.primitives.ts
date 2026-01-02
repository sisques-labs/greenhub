import { PlantPrimitives } from '@/core/plant-context/domain/primitives/plant/plant.primitives';

export type GrowingUnitPrimitives = {
	id: string;
	locationId: string;
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
