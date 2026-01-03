import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class TenantViewModelIdRequiredException extends BaseDomainException {
	constructor() {
		super('Tenant id is required to build TenantViewModel');
	}
}

