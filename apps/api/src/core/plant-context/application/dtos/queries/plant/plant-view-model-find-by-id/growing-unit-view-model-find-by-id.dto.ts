/**
 * Data transfer object for finding a plant view model by its unique identifier.
 *
 * @interface IPlantViewModelFindByIdQueryDto
 * @property {string} id - The unique identifier of the plant view model to find.
 */
export interface IPlantViewModelFindByIdQueryDto {
  /** The unique identifier of the plant view model to find. */
  id: string;
}
