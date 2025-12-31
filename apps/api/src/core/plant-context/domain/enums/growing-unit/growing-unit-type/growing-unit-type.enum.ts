/**
 * Represents the various possible types of a container entity.
 *
 * @remarks
 * This enum defines the different types of containers available in the application.
 *
 * @enum
 * - {@link ContainerTypeEnum.POT}: A pot container for individual plants.
 * - {@link ContainerTypeEnum.GARDEN_BED}: A garden bed for multiple plants.
 * - {@link ContainerTypeEnum.HANGING_BASKET}: A hanging basket container.
 * - {@link ContainerTypeEnum.WINDOW_BOX}: A window box container.
 */
export enum GrowingUnitTypeEnum {
	/** A pot container for individual plants. */
	POT = "POT",

	/** A garden bed for multiple plants. */
	GARDEN_BED = "GARDEN_BED",

	/** A hanging basket container. */
	HANGING_BASKET = "HANGING_BASKET",

	/** A window box container. */
	WINDOW_BOX = "WINDOW_BOX",
}
