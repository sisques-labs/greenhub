/**
 * Data Transfer Object for finding a plant by ID via query layer.
 *
 * @interface IPlantFindByIdQueryDto
 * @property {string} id - The unique identifier of the plant to find
 */
export interface IPlantFindByIdQueryDto {
  id: string;
}
