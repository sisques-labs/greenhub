/**
 * Represents the event data associated with a location.
 *
 * @remarks
 * This interface captures core identifying and descriptive information for a location.
 *
 * @property id - Unique identifier for the location.
 * @property name - Name of the location.
 * @property type - The type/category of the location (e.g., ROOM, BALCONY, GARDEN, etc.).
 * @property description - Optional description of the location.
 * @property parentLocationId - Optional parent location identifier for hierarchical locations.
 */
export interface ILocationEventData {
	/** Unique identifier for the location. */
	id: string;

	/** Name of the location. */
	name: string;

	/** Type/category of the location (e.g., ROOM, BALCONY, GARDEN, etc.). */
	type: string;

	/** Optional description of the location. */
	description: string | null;

	/** Optional parent location identifier for hierarchical locations. */
	parentLocationId: string | null;
}

