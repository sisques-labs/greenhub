import type { PlantResponse } from "../../plants/index.js";
import { GrowingUnitDimensions } from "./growing-unit-dimensions.type.js";

export type GrowingUnitResponse = {
	id: string;
	name: string;
	type: string;
	capacity: number;
	dimensions?: GrowingUnitDimensions | null;
	plants: PlantResponse[];
	numberOfPlants: number;
	remainingCapacity: number;
	volume: number;
	createdAt: Date;
	updatedAt: Date;
};

