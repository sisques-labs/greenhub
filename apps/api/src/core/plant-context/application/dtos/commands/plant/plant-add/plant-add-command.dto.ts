/**
 * Data Transfer Object for adding a plant to a growing unit via command layer.
 *
 * @interface IPlantAddCommandDto
 * @property {string} growingUnitId - The id of the growing unit to add the plant to
 * @property {string} name - The name of the plant
 * @property {string} species - The species of the plant
 * @property {Date | null} [plantedDate] - The date when the plant was planted. Can be null if not provided.
 * @property {string | null} [notes] - Notes related to the plant. Can be null if not provided.
 * @property {string} [status] - The status of the plant. Defaults to PLANTED if not provided.
 */
export interface IPlantAddCommandDto {
  growingUnitId: string;
  name: string;
  species: string;
  plantedDate?: Date | null;
  notes?: string | null;
  status?: string;
}
