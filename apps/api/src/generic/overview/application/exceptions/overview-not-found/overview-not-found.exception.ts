import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

export class OverviewNotFoundException extends BaseApplicationException {
	constructor(overviewId: string) {
		super(`Overview with id ${overviewId} not found`);
	}
}
