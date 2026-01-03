import { ITenantFindByIdQueryDto } from '@/generic/tenants/application/dtos/queries/tenant-find-by-id/tenant-find-by-id-query.dto';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';

export class TenantFindByIdQuery {
	readonly id: TenantUuidValueObject;

	constructor(props: ITenantFindByIdQueryDto) {
		this.id = new TenantUuidValueObject(props.id);
	}
}

