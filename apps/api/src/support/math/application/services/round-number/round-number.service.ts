import { Injectable, Logger } from '@nestjs/common';

/**
 * Service for rounding numbers.
 *
 * @remarks
 * This service provides methods to round numbers to specified decimal places.
 */
@Injectable()
export class RoundNumberService {
  private readonly logger = new Logger(RoundNumberService.name);

  /**
   * Rounds a number to the specified number of decimal places.
   *
   * @param value - The number to round
   * @param decimals - Number of decimal places (default: 2)
   * @returns The rounded number
   *
   * @example
   * ```typescript
   * const rounded = service.execute(3.14159, 2); // Returns 3.14
   * const rounded = service.execute(3.14159, 0); // Returns 3
   * ```
   */
  execute(value: number, decimals: number = 2): number {
    this.logger.debug(`Rounding ${value} to ${decimals} decimals`);
    return Number(value.toFixed(decimals));
  }

  /**
   * Rounds a number up to the nearest integer.
   *
   * @param value - The number to round up
   * @returns The rounded up number
   *
   * @example
   * ```typescript
   * const rounded = service.roundUp(3.1); // Returns 4
   * ```
   */
  roundUp(value: number): number {
    return Math.ceil(value);
  }

  /**
   * Rounds a number down to the nearest integer.
   *
   * @param value - The number to round down
   * @returns The rounded down number
   *
   * @example
   * ```typescript
   * const rounded = service.roundDown(3.9); // Returns 3
   * ```
   */
  roundDown(value: number): number {
    return Math.floor(value);
  }
}
