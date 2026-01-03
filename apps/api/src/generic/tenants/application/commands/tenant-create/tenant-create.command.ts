import { ITenantCreateCommandDto } from '@/generic/tenants/application/dtos/commands/tenant-create/tenant-create-command.dto';
import { TenantClerkIdValueObject } from '@/generic/tenants/domain/value-objects/tenant-clerk-id/tenant-clerk-id.vo';
import { TenantNameValueObject } from '@/generic/tenants/domain/value-objects/tenant-name/tenant-name.vo';
import { TenantStatusValueObject } from '@/generic/tenants/domain/value-objects/tenant-status/tenant-status.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';

export class TenantCreateCommand {
	readonly id: TenantUuidValueObject;
	readonly clerkId: TenantClerkIdValueObject;
	readonly name: TenantNameValueObject;
	readonly status: TenantStatusValueObject;

	constructor(props: ITenantCreateCommandDto) {
		this.id = props.id
			? new TenantUuidValueObject(props.id)
			: new TenantUuidValueObject();

		this.clerkId = new TenantClerkIdValueObject(props.clerkId);
		this.name = new TenantNameValueObject(props.name);
		this.status = new TenantStatusValueObject(props.status);
	}
}

