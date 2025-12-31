import { EnumValueObject } from '@/shared/domain/value-objects/enum/enum.vo';
import { HealthStatusEnum } from '@/support/health/domain/enum/health-status.enum';

export class HealthStatusValueObject extends EnumValueObject<
	typeof HealthStatusEnum
> {
	protected get enumObject(): typeof HealthStatusEnum {
		return HealthStatusEnum;
	}
}
