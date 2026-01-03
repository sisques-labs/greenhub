import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class TenantViewModelNameRequiredException extends BaseDomainException {
	constructor() {
		super('Tenant name is required to build TenantViewModel');
	}
}

