/**
 * Represents the event data associated with a plant within a growing unit context.
 *
 * @remarks
 * This interface captures core identifying and descriptive information for a plant
 * that is part of a growing unit.
 *
 * @property id - Unique identifier for the plant.
 * @property growingUnitId - Unique identifier for the growing unit containing this plant.
 * @property name - Name of the plant.
 * @property species - Species of the plant.
 * @property plantedDate - Date when the plant was planted (nullable).
 * @property notes - Additional notes about the plant (nullable).
 * @property status - Current status of the plant.
 */
export interface IPlantEventData {
	/** Unique identifier for the plant. */
	id: string;

	/** Unique identifier for the growing unit containing this plant. */
	growingUnitId: string;

	/** Name of the plant. */
	name: string;

	/** Species of the plant. */
	species: string;

	/** Date when the plant was planted (nullable). */
	plantedDate: Date | null;

	/** Additional notes about the plant (nullable). */
	notes: string | null;

	/** Current status of the plant. */
	status: string;
}
