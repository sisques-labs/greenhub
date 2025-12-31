/**
 * Represents the various possible statuses of a plant entity.
 *
 * @remarks
 * This enum defines the lifecycle stages and system-level states applicable to a plant within the application.
 *
 * @enum
 * - {@link PlantStatusEnum.PLANTED}: The plant has been planted (initial state).
 * - {@link PlantStatusEnum.GROWING}: The plant is actively growing (normal/active state).
 * - {@link PlantStatusEnum.HARVESTED}: The plant has been harvested (for harvestable plants).
 * - {@link PlantStatusEnum.DEAD}: The plant has died.
 * - {@link PlantStatusEnum.ARCHIVED}: The plant has been archived (soft delete, not exposed in API).
 */
export enum PlantStatusEnum {
	/** The plant has been planted (initial state). */
	PLANTED = 'PLANTED',

	/** The plant is actively growing (normal/active state). */
	GROWING = 'GROWING',

	/** The plant has been harvested (for harvestable plants). */
	HARVESTED = 'HARVESTED',

	/** The plant has died. */
	DEAD = 'DEAD',

	/** The plant has been archived (soft delete, not exposed in API). */
	ARCHIVED = 'ARCHIVED',
}
