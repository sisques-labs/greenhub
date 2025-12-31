import { BaseDomainException } from "@/shared/domain/exceptions/base-domain.exception";

export class GrowingUnitPlantNotFoundException extends BaseDomainException {
	constructor(growingUnitId: string, plantId: string) {
		super(`Plant ${plantId} not found in growing unit ${growingUnitId}`);
	}
}
