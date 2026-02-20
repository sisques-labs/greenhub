/**
 * Data transfer object for finding plant species by difficulty.
 *
 * @interface IPlantSpeciesFindByDifficultyQueryDto
 * @property {string} difficulty - The difficulty level to filter plant species by.
 */
export interface IPlantSpeciesFindByDifficultyQueryDto {
	/** The difficulty level to filter plant species by. */
	difficulty: string;
}
