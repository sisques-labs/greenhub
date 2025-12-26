/**
 * Data Transfer Object for deleting a plant via command layer.
 *
 * @interface IPlantDeleteCommandDto
 * @property {string} id - The unique identifier of the plant to delete
 */
export interface IPlantDeleteCommandDto {
  id: string;
}
