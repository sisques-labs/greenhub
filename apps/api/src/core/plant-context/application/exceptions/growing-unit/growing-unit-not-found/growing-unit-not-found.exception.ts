import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

/**
 * Exception thrown when a growing unit is not found.
 *
 * @remarks
 * This exception is raised when attempting to access a growing unit that does not exist
 * in the system, typically during query or update operations.
 */
export class GrowingUnitNotFoundException extends BaseApplicationException {
	constructor(growingUnitId: string) {
		super(`Growing unit with id ${growingUnitId} not found`);
	}
}
