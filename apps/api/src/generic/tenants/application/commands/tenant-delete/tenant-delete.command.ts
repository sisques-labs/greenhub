import { ITenantDeleteCommandDto } from '@/generic/tenants/application/dtos/commands/tenant-delete/tenant-delete-command.dto';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';

export class TenantDeleteCommand {
	readonly id: TenantUuidValueObject;

	constructor(props: ITenantDeleteCommandDto) {
		this.id = new TenantUuidValueObject(props.id);
	}
}

