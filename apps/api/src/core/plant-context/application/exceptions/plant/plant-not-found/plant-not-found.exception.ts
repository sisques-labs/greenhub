import { BaseApplicationException } from "@/shared/application/exceptions/base-application/base-application.exception";

/**
 * Exception thrown when a plant is not found.
 *
 * @remarks
 * This exception is raised when attempting to access a plant that does not exist
 * in the system, typically during query or update operations.
 */
export class PlantNotFoundException extends BaseApplicationException {
	constructor(plantId: string) {
		super(`Plant with id ${plantId} not found`);
	}
}
