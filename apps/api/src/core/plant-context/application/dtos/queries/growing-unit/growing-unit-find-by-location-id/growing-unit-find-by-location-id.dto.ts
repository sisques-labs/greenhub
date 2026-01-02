/**
 * Data transfer object for finding growing units by location ID.
 *
 * @interface IGrowingUnitFindByLocationIdQueryDto
 * @property {string} locationId - The unique identifier of the location to find growing units for.
 */
export interface IGrowingUnitFindByLocationIdQueryDto {
	/** The unique identifier of the location to find growing units for. */
	locationId: string;
}

