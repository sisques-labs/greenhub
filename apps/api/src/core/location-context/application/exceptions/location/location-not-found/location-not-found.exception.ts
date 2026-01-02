import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

/**
 * Exception thrown when a location is not found.
 *
 * @remarks
 * This exception is raised when attempting to access a location that does not exist
 * in the system, typically during query or update operations.
 */
export class LocationNotFoundException extends BaseApplicationException {
	constructor(locationId: string) {
		super(`Location with id ${locationId} not found`);
	}
}

