/**
 * Data Transfer Object for changing a plant's container via command layer.
 *
 * @interface IPlantChangeContainerCommandDto
 * @property {string} id - The unique identifier of the plant to update
 * @property {string} newContainerId - The new container identifier for the plant
 */
export interface IPlantChangeContainerCommandDto {
  id: string;
  newContainerId: string;
}
