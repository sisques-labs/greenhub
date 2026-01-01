import { ILocationUpdateCommandDto } from '@/core/location-context/application/dtos/commands/location/location-update/location-update-command.dto';
import { LocationDescriptionValueObject } from '@/core/location-context/domain/value-objects/location/location-description/location-description.vo';
import { LocationNameValueObject } from '@/core/location-context/domain/value-objects/location/location-name/location-name.vo';
import { LocationTypeValueObject } from '@/core/location-context/domain/value-objects/location/location-type/location-type.vo';
import { LocationUuidValueObject } from '@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo';

/**
 * Command for updating an existing location.
 *
 * @remarks
 * This command encapsulates the data needed to update a location aggregate,
 * converting primitives to value objects.
 */
export class LocationUpdateCommand {
	readonly id: LocationUuidValueObject;
	readonly name?: LocationNameValueObject;
	readonly type?: LocationTypeValueObject;
	readonly description?: LocationDescriptionValueObject | null;

	constructor(props: ILocationUpdateCommandDto) {
		this.id = new LocationUuidValueObject(props.id);
		this.name = props.name
			? new LocationNameValueObject(props.name)
			: undefined;
		this.type = props.type
			? new LocationTypeValueObject(props.type)
			: undefined;
		this.description =
			props.description !== undefined
				? props.description
					? new LocationDescriptionValueObject(props.description)
					: null
				: undefined;
	}
}

