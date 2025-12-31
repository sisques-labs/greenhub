import { IPlantEventData } from '@/core/plant-context/domain/events/plant/interfaces/plant-event-data.interface';

/**
 * Represents the event data associated with a growing unit.
 *
 * @remarks
 * This interface captures core identifying and descriptive information for a growing unit,
 * as well as its associated plants.
 *
 * @property id - Unique identifier for the growing unit.
 * @property name - Name of the growing unit.
 * @property type - The type/category of the growing unit (e.g., greenhouse, hydroponic, etc.).
 * @property capacity - Maximum capacity the growing unit can handle (e.g., number of plants).
 * @property dimensions - Dimensions of the growing unit.
 * @property unit - Unit of measurement for dimensions.
 * @property plants - Array of plant event data representing the plants currently in this unit.
 */
export interface IGrowingUnitEventData {
	/** Unique identifier for the growing unit. */
	id: string;

	/** Name of the growing unit. */
	name: string;

	/** Type/category of the growing unit (e.g., greenhouse, hydroponic, etc.). */
	type: string;

	/** Maximum capacity the growing unit can handle (e.g., number of plants). */
	capacity: number;

	/** Dimensions of the growing unit. */
	dimensions: {
		length: number;
		width: number;
		height: number;
		unit: string;
	} | null;

	/** Plants currently in this growing unit. */
	plants: IPlantEventData[];
}
