import { ISagaStepCreateCommandDto } from '@/generic/saga-context/saga-step/application/dtos/commands/saga-step-create/saga-step-create-command.dto';
import { SagaStepStatusEnum } from '@/generic/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import { SagaStepEndDateValueObject } from '@/generic/saga-context/saga-step/domain/value-objects/saga-step-end-date/saga-step-end-date.vo';
import { SagaStepErrorMessageValueObject } from '@/generic/saga-context/saga-step/domain/value-objects/saga-step-error-message/saga-step-error-message.vo';
import { SagaStepMaxRetriesValueObject } from '@/generic/saga-context/saga-step/domain/value-objects/saga-step-max-retries/saga-step-max-retries.vo';
import { SagaStepNameValueObject } from '@/generic/saga-context/saga-step/domain/value-objects/saga-step-name/saga-step-name.vo';
import { SagaStepOrderValueObject } from '@/generic/saga-context/saga-step/domain/value-objects/saga-step-order/saga-step-order.vo';
import { SagaStepPayloadValueObject } from '@/generic/saga-context/saga-step/domain/value-objects/saga-step-payload/saga-step-payload.vo';
import { SagaStepResultValueObject } from '@/generic/saga-context/saga-step/domain/value-objects/saga-step-result/saga-step-result.vo';
import { SagaStepRetryCountValueObject } from '@/generic/saga-context/saga-step/domain/value-objects/saga-step-retry-count/saga-step-retry-count.vo';
import { SagaStepStartDateValueObject } from '@/generic/saga-context/saga-step/domain/value-objects/saga-step-start-date/saga-step-start-date.vo';
import { SagaStepStatusValueObject } from '@/generic/saga-context/saga-step/domain/value-objects/saga-step-status/saga-step-status.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';

export class SagaStepCreateCommand {
	readonly id: SagaStepUuidValueObject;
	readonly sagaInstanceId: SagaInstanceUuidValueObject;
	readonly name: SagaStepNameValueObject;
	readonly order: SagaStepOrderValueObject;
	readonly status: SagaStepStatusValueObject;
	readonly startDate: SagaStepStartDateValueObject | null;
	readonly endDate: SagaStepEndDateValueObject | null;
	readonly errorMessage: SagaStepErrorMessageValueObject | null;
	readonly retryCount: SagaStepRetryCountValueObject;
	readonly maxRetries: SagaStepMaxRetriesValueObject;
	readonly payload: SagaStepPayloadValueObject;
	readonly result: SagaStepResultValueObject | null;

	constructor(props: ISagaStepCreateCommandDto) {
		this.id = new SagaStepUuidValueObject();
		this.sagaInstanceId = new SagaInstanceUuidValueObject(props.sagaInstanceId);
		this.name = new SagaStepNameValueObject(props.name);
		this.order = new SagaStepOrderValueObject(props.order);
		this.status = new SagaStepStatusValueObject(SagaStepStatusEnum.PENDING);
		this.startDate = null;
		this.endDate = null;
		this.errorMessage = null;
		this.retryCount = new SagaStepRetryCountValueObject(0);
		this.maxRetries = new SagaStepMaxRetriesValueObject(3);
		this.payload = new SagaStepPayloadValueObject(props.payload);
		this.result = null;
	}
}
