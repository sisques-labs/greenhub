import { ILocationDeleteCommandDto } from '@/core/location-context/application/dtos/commands/location/location-delete/location-delete-command.dto';
import { LocationUuidValueObject } from '@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo';

/**
 * Command for deleting a location.
 *
 * @remarks
 * This command encapsulates the data needed to delete a location aggregate.
 */
export class LocationDeleteCommand {
	readonly id: LocationUuidValueObject;

	constructor(props: ILocationDeleteCommandDto) {
		this.id = new LocationUuidValueObject(props.id);
	}
}

