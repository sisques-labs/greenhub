/**
 * Data transfer object for finding a growing unit view model by its unique identifier.
 *
 * @interface IGrowingUnitViewModelFindByIdQueryDto
 * @property {string} id - The unique identifier of the growing unit view model to find.
 */
export interface IGrowingUnitViewModelFindByIdQueryDto {
  /** The unique identifier of the growing unit view model to find. */
  id: string;
}
