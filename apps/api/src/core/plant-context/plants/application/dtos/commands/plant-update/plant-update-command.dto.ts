/**
 * Data Transfer Object for updating an existing plant via command layer.
 *
 * @interface IPlantUpdateCommandDto
 * @property {string} id - The unique identifier of the plant to update
 * @property {string} [name] - The name of the plant
 * @property {string} [species] - The species of the plant
 * @property {Date | null} [plantedDate] - The date when the plant was planted. Can be null to clear the date.
 * @property {string | null} [notes] - Notes related to the plant. Can be null to clear notes.
 * @property {string} [status] - The status of the plant
 */
export interface IPlantUpdateCommandDto {
  id: string;
  name?: string;
  species?: string;
  plantedDate?: Date | null;
  notes?: string | null;
  status?: string;
}
