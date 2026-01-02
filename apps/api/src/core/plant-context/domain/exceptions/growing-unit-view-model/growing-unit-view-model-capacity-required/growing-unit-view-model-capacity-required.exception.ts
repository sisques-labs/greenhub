import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class GrowingUnitViewModelCapacityRequiredException extends BaseDomainException {
	constructor() {
		super('Growing unit capacity is required to build GrowingUnitViewModel');
	}
}

