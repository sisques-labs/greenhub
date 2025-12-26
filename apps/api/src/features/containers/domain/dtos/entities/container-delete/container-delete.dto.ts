import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/container-uuid/container-uuid.vo';

/**
 * Represents the data structure for deleting a container entity.
 *
 * @remarks
 * This interface defines the contract for deleting a container entity in the system.
 * It only requires the container identifier.
 *
 * @public
 */
export interface IContainerDeleteDto {
  id: ContainerUuidValueObject;
}
