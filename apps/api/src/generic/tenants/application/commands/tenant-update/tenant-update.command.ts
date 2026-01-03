import { ITenantUpdateCommandDto } from '@/generic/tenants/application/dtos/commands/tenant-update/tenant-update-command.dto';
import { TenantNameValueObject } from '@/generic/tenants/domain/value-objects/tenant-name/tenant-name.vo';
import { TenantStatusValueObject } from '@/generic/tenants/domain/value-objects/tenant-status/tenant-status.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';

export class TenantUpdateCommand {
	readonly id: TenantUuidValueObject;
	readonly name?: TenantNameValueObject;
	readonly status?: TenantStatusValueObject;

	constructor(props: ITenantUpdateCommandDto) {
		this.id = new TenantUuidValueObject(props.id);

		this.name = props.name
			? new TenantNameValueObject(props.name)
			: undefined;

		this.status = props.status
			? new TenantStatusValueObject(props.status)
			: undefined;
	}
}

