/**
 * Data Transfer Object for finding plants by container ID via query layer.
 *
 * @interface IPlantFindByContainerIdQueryDto
 * @property {string} containerId - The unique identifier of the container to find plants for
 */
export interface IPlantFindByContainerIdQueryDto {
  containerId: string;
}
