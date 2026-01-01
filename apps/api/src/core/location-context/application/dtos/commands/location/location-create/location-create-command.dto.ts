/**
 * Data Transfer Object for creating a new location via command layer.
 *
 * @interface ILocationCreateCommandDto
 * @property {string} name - The name of the location
 * @property {string} type - The type of the location
 * @property {string | null} [description] - The description of the location. Optional.
 */
export interface ILocationCreateCommandDto {
	name: string;
	type: string;
	description?: string | null;
}

