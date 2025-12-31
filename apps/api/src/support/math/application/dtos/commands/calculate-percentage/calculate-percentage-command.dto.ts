/**
 * Data Transfer Object for calculating percentage via command layer.
 *
 * @interface ICalculatePercentageCommandDto
 * @property {number} value - The value to calculate the percentage for
 * @property {number} total - The total value (100%)
 * @property {number} [decimals] - Number of decimal places (default: 2)
 */
export interface ICalculatePercentageCommandDto {
	value: number;
	total: number;
	decimals?: number;
}

