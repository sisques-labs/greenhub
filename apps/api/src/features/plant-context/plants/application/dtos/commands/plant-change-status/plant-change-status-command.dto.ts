/**
 * Data Transfer Object for changing a plant status via command layer.
 *
 * @interface IPlantChangeStatusCommandDto
 * @property {string} id - The unique identifier of the plant
 * @property {string} status - The new status for the plant
 */
export interface IPlantChangeStatusCommandDto {
  id: string;
  status: string;
}
