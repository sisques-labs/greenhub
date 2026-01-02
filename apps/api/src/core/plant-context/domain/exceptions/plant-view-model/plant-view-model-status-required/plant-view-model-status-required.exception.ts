import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class PlantViewModelStatusRequiredException extends BaseDomainException {
	constructor() {
		super('Plant status is required to build PlantViewModel');
	}
}

