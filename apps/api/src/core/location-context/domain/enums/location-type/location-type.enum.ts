/**
 * Represents the various possible types of a location entity.
 *
 * @remarks
 * This enum defines the different types of locations available in the application.
 *
 * @enum
 * - {@link LocationTypeEnum.ROOM}: An indoor room location.
 * - {@link LocationTypeEnum.BALCONY}: A balcony location.
 * - {@link LocationTypeEnum.GARDEN}: An outdoor garden location.
 * - {@link LocationTypeEnum.GREENHOUSE}: A greenhouse location.
 * - {@link LocationTypeEnum.OUTDOOR_SPACE}: A general outdoor space.
 * - {@link LocationTypeEnum.INDOOR_SPACE}: A general indoor space.
 */
export enum LocationTypeEnum {
	/** An indoor room location. */
	ROOM = "ROOM",

	/** A balcony location. */
	BALCONY = "BALCONY",

	/** An outdoor garden location. */
	GARDEN = "GARDEN",

	/** A greenhouse location. */
	GREENHOUSE = "GREENHOUSE",

	/** A general outdoor space. */
	OUTDOOR_SPACE = "OUTDOOR_SPACE",

	/** A general indoor space. */
	INDOOR_SPACE = "INDOOR_SPACE",
}
