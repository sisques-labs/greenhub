import { PlantStatus } from "./plant-status.type.js";

export type UpdatePlantInput = {
	id: string;
	name?: string;
	species?: string;
	plantedDate?: Date | null;
	notes?: string | null;
	status?: PlantStatus;
};
