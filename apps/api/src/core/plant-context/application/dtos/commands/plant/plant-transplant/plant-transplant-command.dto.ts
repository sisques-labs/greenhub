/**
 * Data Transfer Object for transplanting a plant between growing units via command layer.
 *
 * @interface IPlantTransplantCommandDto
 * @property {string} sourceGrowingUnitId - The id of the growing unit from which the plant will be transplanted
 * @property {string} targetGrowingUnitId - The id of the growing unit to which the plant will be transplanted
 * @property {string} plantId - The id of the plant to be transplanted
 */
export interface IPlantTransplantCommandDto {
	sourceGrowingUnitId: string;
	targetGrowingUnitId: string;
	plantId: string;
}

