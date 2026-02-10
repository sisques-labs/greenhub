import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

/**
 * Exception thrown when attempting to delete a location that has dependent growing units.
 *
 * @remarks
 * This exception is raised when a location cannot be deleted because it still has
 * associated growing units. The location must have no dependent growing units before
 * it can be safely deleted.
 */
export class LocationHasDependentGrowingUnitsException extends BaseApplicationException {
	constructor(locationId: string, growingUnitCount: number) {
		super(
			`Cannot delete location with id ${locationId}. It has ${growingUnitCount} dependent growing unit${growingUnitCount !== 1 ? 's' : ''}. Please remove or reassign all growing units before deleting the location.`,
		);
	}
}
