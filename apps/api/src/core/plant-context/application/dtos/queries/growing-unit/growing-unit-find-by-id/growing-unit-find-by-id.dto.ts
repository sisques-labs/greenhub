/**
 * Data transfer object for finding a growing unit by its unique identifier.
 *
 * @interface IGrowingUnitFindByIdQueryDto
 * @property {string} id - The unique identifier of the growing unit to find.
 */
export interface IGrowingUnitFindByIdQueryDto {
	/** The unique identifier of the growing unit to find. */
	id: string;
}
