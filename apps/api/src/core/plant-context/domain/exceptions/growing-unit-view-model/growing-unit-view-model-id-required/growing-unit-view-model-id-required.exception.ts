import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class GrowingUnitViewModelIdRequiredException extends BaseDomainException {
	constructor() {
		super('Growing unit id is required to build GrowingUnitViewModel');
	}
}

