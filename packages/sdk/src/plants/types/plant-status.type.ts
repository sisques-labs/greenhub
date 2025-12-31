export type PlantStatus =
	| "PLANTED"
	| "GROWING"
	| "HARVESTED"
	| "DEAD"
	| "ARCHIVED";

export const PLANT_STATUS = {
	PLANTED: "PLANTED",
	GROWING: "GROWING",
	HARVESTED: "HARVESTED",
	DEAD: "DEAD",
	ARCHIVED: "ARCHIVED",
} as const;
