/**
 * Data Transfer Object for creating a new growing unit via command layer.
 *
 * @interface IGrowingUnitCreateCommandDto
 * @property {string} name - The name of the growing unit
 * @property {string} type - The type of the growing unit
 * @property {number} capacity - The capacity of the growing unit
 * @property {number} [length] - The length of the growing unit. Optional.
 * @property {number} [width] - The width of the growing unit. Optional.
 * @property {number} [height] - The height of the growing unit. Optional.
 * @property {string} [unit] - The unit of measurement for dimensions. Optional.
 */
export interface IGrowingUnitCreateCommandDto {
  name: string;
  type: string;
  capacity: number;
  length?: number;
  width?: number;
  height?: number;
  unit?: string;
}
