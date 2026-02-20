import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class InvalidPlantSpeciesMatureSizeWidthException extends BaseDomainException {
	constructor(width: number) {
		super(`Mature size width must be greater than 0, got ${width}`);
	}
}
