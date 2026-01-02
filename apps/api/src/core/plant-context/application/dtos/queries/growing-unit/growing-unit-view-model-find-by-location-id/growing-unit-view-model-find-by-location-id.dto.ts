/**
 * Data transfer object for finding growing unit view models by location ID.
 *
 * @interface IGrowingUnitViewModelFindByLocationIdQueryDto
 * @property {string} locationId - The unique identifier of the location to find growing unit view models for.
 */
export interface IGrowingUnitViewModelFindByLocationIdQueryDto {
	/** The unique identifier of the location to find growing unit view models for. */
	locationId: string;
}

