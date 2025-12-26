/**
 * Data Transfer Object for deleting a container via command layer.
 *
 * @interface IContainerDeleteCommandDto
 * @property {string} id - The id of the container to delete
 */
export interface IContainerDeleteCommandDto {
  id: string;
}
