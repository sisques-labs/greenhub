import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

/**
 * Exception thrown when a container is not found.
 *
 * @remarks
 * This exception is raised when attempting to access a container that does not exist
 * in the system, typically during query or update operations.
 */
export class ContainerNotFoundException extends BaseApplicationException {
  constructor(containerId: string) {
    super(`Container with id ${containerId} not found`);
  }
}
