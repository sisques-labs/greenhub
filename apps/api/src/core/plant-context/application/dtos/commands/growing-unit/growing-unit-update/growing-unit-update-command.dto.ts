/**
 * Data Transfer Object for updating an existing container via command layer.
 *
 * @interface IGrowingUnitUpdateCommandDto
 * @property {string} id - The id of the container to update
 * @property {string} [name] - The name of the growing unit. Optional.
 * @property {string} [type] - The type of the growing unit. Optional.
 */
export interface IGrowingUnitUpdateCommandDto {
  id: string;
  name?: string;
  type?: string;
  capacity?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  } | null;
}
