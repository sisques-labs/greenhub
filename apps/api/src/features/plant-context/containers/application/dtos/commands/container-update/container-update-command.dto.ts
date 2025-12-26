/**
 * Data Transfer Object for updating an existing container via command layer.
 *
 * @interface IContainerUpdateCommandDto
 * @property {string} id - The id of the container to update
 * @property {string} [name] - The name of the container. Optional.
 * @property {string} [type] - The type of the container. Optional.
 */
export interface IContainerUpdateCommandDto {
  id: string;
  name?: string;
  type?: string;
}
