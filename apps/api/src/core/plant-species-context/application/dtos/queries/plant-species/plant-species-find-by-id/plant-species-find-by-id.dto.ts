/**
 * Data transfer object for finding a plant species by its unique identifier.
 *
 * @interface IPlantSpeciesFindByIdQueryDto
 * @property {string} id - The unique identifier of the plant species to find.
 */
export interface IPlantSpeciesFindByIdQueryDto {
	/** The unique identifier of the plant species to find. */
	id: string;
}
