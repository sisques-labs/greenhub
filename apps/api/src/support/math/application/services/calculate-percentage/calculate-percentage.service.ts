import { Injectable, Logger } from '@nestjs/common';

/**
 * Service for calculating percentages.
 *
 * @remarks
 * This service provides methods to calculate percentages from various inputs,
 * useful for metrics like occupancy rates, completion percentages, etc.
 */
@Injectable()
export class CalculatePercentageService {
	private readonly logger = new Logger(CalculatePercentageService.name);

	/**
	 * Calculates the percentage of a value relative to a total.
	 *
	 * @param value - The value to calculate the percentage for
	 * @param total - The total value (100%)
	 * @param decimals - Number of decimal places (default: 2)
	 * @returns The percentage value (0-100)
	 *
	 * @example
	 * ```typescript
	 * const percentage = service.execute(25, 100, 2); // Returns 25.00
	 * const occupancy = service.execute(8, 10, 1); // Returns 80.0
	 * ```
	 */
	execute(value: number, total: number, decimals: number = 2): number {
		this.logger.debug(
			`Calculating percentage: ${value} / ${total} with ${decimals} decimals`,
		);

		if (total === 0) {
			this.logger.warn('Total is zero, returning 0');
			return 0;
		}

		if (value < 0 || total < 0) {
			this.logger.warn('Negative values detected, returning 0');
			return 0;
		}

		const percentage = (value / total) * 100;
		return Number(percentage.toFixed(decimals));
	}

	/**
	 * Calculates the percentage of used capacity.
	 *
	 * @param used - The used capacity
	 * @param total - The total capacity
	 * @param decimals - Number of decimal places (default: 2)
	 * @returns The occupancy percentage (0-100)
	 *
	 * @example
	 * ```typescript
	 * const occupancy = service.calculateOccupancy(8, 10); // Returns 80.00
	 * ```
	 */
	calculateOccupancy(
		used: number,
		total: number,
		decimals: number = 2,
	): number {
		return this.execute(used, total, decimals);
	}

	/**
	 * Calculates the percentage of remaining capacity.
	 *
	 * @param remaining - The remaining capacity
	 * @param total - The total capacity
	 * @param decimals - Number of decimal places (default: 2)
	 * @returns The remaining percentage (0-100)
	 *
	 * @example
	 * ```typescript
	 * const remaining = service.calculateRemaining(2, 10); // Returns 20.00
	 * ```
	 */
	calculateRemaining(
		remaining: number,
		total: number,
		decimals: number = 2,
	): number {
		return this.execute(remaining, total, decimals);
	}
}


