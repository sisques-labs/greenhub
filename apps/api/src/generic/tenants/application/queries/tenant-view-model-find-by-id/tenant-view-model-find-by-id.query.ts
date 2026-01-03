import { ITenantViewModelFindByIdQueryDto } from '@/generic/tenants/application/dtos/queries/tenant-view-model-find-by-id/tenant-view-model-find-by-id-query.dto';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';

export class TenantViewModelFindByIdQuery {
	readonly id: TenantUuidValueObject;

	constructor(props: ITenantViewModelFindByIdQueryDto) {
		this.id = new TenantUuidValueObject(props.id);
	}
}

