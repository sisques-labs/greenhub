import { NumberValueObject } from '@/shared/domain/value-objects/number/number.vo';

/**
 * Value object representing the capacity of a growing unit.
 *
 * @remarks
 * This class encapsulates the logic and invariants for growing unit capacity in the domain.
 * It extends {@link NumberValueObject} to inherit common number value object behavior
 * and provides utility methods for capacity management.
 *
 * @example
 * const capacity = new GrowingUnitCapacityValueObject(10);
 * capacity.hasCapacity(5); // true
 * capacity.hasCapacity(10); // false
 * capacity.getRemainingCapacity(7); // 3
 */
export class GrowingUnitCapacityValueObject extends NumberValueObject {
  constructor(value: number | string) {
    super(value, {
      min: 1,
      allowDecimals: false,
    });
  }

  /**
   * Gets the maximum capacity value.
   *
   * @returns The maximum capacity
   */
  public get maxCapacity(): number {
    return this.value;
  }

  /**
   * Checks if there is available capacity for the given current count.
   *
   * @param currentCount - The current number of items
   * @returns True if there is available capacity
   */
  public hasCapacity(currentCount: number): boolean {
    return currentCount < this.value;
  }

  /**
   * Gets the remaining capacity for the given current count.
   *
   * @param currentCount - The current number of items
   * @returns The remaining capacity (0 if full or over capacity)
   */
  public getRemainingCapacity(currentCount: number): number {
    const remaining = this.value - currentCount;
    return Math.max(0, remaining);
  }

  /**
   * Checks if a specific count can be added to the current count.
   *
   * @param currentCount - The current number of items
   * @param countToAdd - The number of items to add
   * @returns True if the count can be added without exceeding capacity
   */
  public canAdd(currentCount: number, countToAdd: number): boolean {
    return currentCount + countToAdd <= this.value;
  }

  /**
   * Gets the available capacity percentage for the given current count.
   *
   * @param currentCount - The current number of items
   * @returns The percentage of available capacity (0-100)
   */
  public getAvailableCapacityPercentage(currentCount: number): number {
    const remaining = this.getRemainingCapacity(currentCount);
    return Math.round((remaining / this.value) * 100);
  }

  /**
   * Gets the used capacity percentage for the given current count.
   *
   * @param currentCount - The current number of items
   * @returns The percentage of used capacity (0-100)
   */
  public getUsedCapacityPercentage(currentCount: number): number {
    const used = Math.min(currentCount, this.value);
    return Math.round((used / this.value) * 100);
  }
}
