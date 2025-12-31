import { BaseDomainException } from "@/shared/domain/exceptions/base-domain.exception";

/**
 * Invalid Dimensions Exception
 * This exception is thrown when a dimensions value is invalid.
 */
export class InvalidDimensionsException extends BaseDomainException {
	constructor(message: string) {
		super(message);
	}
}
