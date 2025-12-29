/**
 * Data transfer object for finding a plant by its unique identifier.
 *
 * @interface IPlantFindByIdQueryDto
 * @property {string} id - The unique identifier of the plant to find.
 */
export interface IPlantFindByIdQueryDto {
  /** The unique identifier of the plant to find. */
  id: string;
}
