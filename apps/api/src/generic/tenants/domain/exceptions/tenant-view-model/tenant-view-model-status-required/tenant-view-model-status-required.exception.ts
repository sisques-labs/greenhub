import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class TenantViewModelStatusRequiredException extends BaseDomainException {
	constructor() {
		super('Tenant status is required to build TenantViewModel');
	}
}

