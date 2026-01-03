import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class TenantViewModelClerkIdRequiredException extends BaseDomainException {
	constructor() {
		super('Tenant clerkId is required to build TenantViewModel');
	}
}

