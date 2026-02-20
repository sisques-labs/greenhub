import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class PlantSpeciesScientificNameAlreadyInUseException extends BaseDomainException {
	constructor(scientificName: string) {
		super(
			`Plant species with scientific name "${scientificName}" already exists`,
		);
	}
}
