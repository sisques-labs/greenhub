/**
 * Data Transfer Object for updating an existing location via command layer.
 *
 * @interface ILocationUpdateCommandDto
 * @property {string} id - The id of the location to update
 * @property {string} [name] - The name of the location. Optional.
 * @property {string} [type] - The type of the location. Optional.
 * @property {string | null} [description] - The description of the location. Optional.
 */
export interface ILocationUpdateCommandDto {
	id: string;
	name?: string;
	type?: string;
	description?: string | null;
}

