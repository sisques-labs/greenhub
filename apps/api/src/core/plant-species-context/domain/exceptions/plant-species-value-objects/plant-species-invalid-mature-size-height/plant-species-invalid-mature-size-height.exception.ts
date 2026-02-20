import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class InvalidPlantSpeciesMatureSizeHeightException extends BaseDomainException {
	constructor(height: number) {
		super(`Mature size height must be greater than 0, got ${height}`);
	}
}
