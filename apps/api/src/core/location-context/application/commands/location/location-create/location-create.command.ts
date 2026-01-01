import type { ILocationCreateCommandDto } from '@/core/location-context/application/dtos/commands/location/location-create/location-create-command.dto';
import { LocationDescriptionValueObject } from '@/core/location-context/domain/value-objects/location/location-description/location-description.vo';
import { LocationNameValueObject } from '@/core/location-context/domain/value-objects/location/location-name/location-name.vo';
import { LocationTypeValueObject } from '@/core/location-context/domain/value-objects/location/location-type/location-type.vo';
import { LocationUuidValueObject } from '@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo';

/**
 * Command for creating a new location.
 *
 * @remarks
 * This command encapsulates the data needed to create a location aggregate,
 * converting primitives to value objects.
 */
export class LocationCreateCommand {
	readonly id: LocationUuidValueObject;
	readonly name: LocationNameValueObject;
	readonly type: LocationTypeValueObject;
	readonly description: LocationDescriptionValueObject | null;

	constructor(props: ILocationCreateCommandDto) {
		this.id = new LocationUuidValueObject();
		this.name = new LocationNameValueObject(props.name);
		this.type = new LocationTypeValueObject(props.type);
		this.description = props.description
			? new LocationDescriptionValueObject(props.description)
			: null;
	}
}

