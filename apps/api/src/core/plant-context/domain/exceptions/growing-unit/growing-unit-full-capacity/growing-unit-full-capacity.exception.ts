import { BaseDomainException } from "@/shared/domain/exceptions/base-domain.exception";

export class GrowingUnitFullCapacityException extends BaseDomainException {
	constructor(growingUnitId: string) {
		super(`Growing unit ${growingUnitId} is at full capacity`);
	}
}
