/**
 * Data transfer object for finding plant species by category.
 *
 * @interface IPlantSpeciesFindByCategoryQueryDto
 * @property {string} category - The category to filter plant species by.
 */
export interface IPlantSpeciesFindByCategoryQueryDto {
	/** The category to filter plant species by. */
	category: string;
}
