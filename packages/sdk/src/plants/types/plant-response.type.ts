import { PlantStatus } from "./plant-status.type.js";

export type PlantResponse = {
	id: string;
	growingUnitId: string;
	name: string;
	species: string;
	plantedDate?: Date | null;
	notes?: string | null;
	status: PlantStatus;
	createdAt?: Date;
	updatedAt?: Date;
};
