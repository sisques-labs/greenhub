/**
 * Data Transfer Object for creating a new container via command layer.
 *
 * @interface IContainerCreateCommandDto
 * @property {string} name - The name of the container
 * @property {string} type - The type of the container
 */
export interface IContainerCreateCommandDto {
  name: string;
  type: string;
}
