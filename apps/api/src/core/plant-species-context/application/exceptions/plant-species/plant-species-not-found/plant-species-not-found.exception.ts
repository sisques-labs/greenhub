import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class PlantSpeciesApplicationNotFoundException extends BaseDomainException {
	constructor(id: string) {
		super(`Plant species with id ${id} not found`);
	}
}
