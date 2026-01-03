import { ITenantEnsureExistsQueryDto } from '@/generic/tenants/application/dtos/queries/tenant-ensure-exists/tenant-ensure-exists-query.dto';

export class TenantEnsureExistsQuery {
	readonly clerkId: string;
	readonly name?: string;
	readonly status?: string;

	constructor(props: ITenantEnsureExistsQueryDto) {
		this.clerkId = props.clerkId;
		this.name = props.name;
		this.status = props.status;
	}
}

