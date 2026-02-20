/**
 * Data transfer object for performing a full-text search on plant species.
 *
 * @interface IPlantSpeciesSearchQueryDto
 * @property {string} query - The search term to use for full-text search.
 */
export interface IPlantSpeciesSearchQueryDto {
	/** The search term to use for full-text search. */
	query: string;
}
