/**
 * Data Transfer Object for removing a plant from a growing unit via command layer.
 *
 * @interface IPlantRemoveCommandDto
 * @property {string} growingUnitId - The id of the growing unit to remove the plant from
 * @property {string} plantId - The id of the plant to remove
 */
export interface IPlantRemoveCommandDto {
	growingUnitId: string;
	plantId: string;
}



