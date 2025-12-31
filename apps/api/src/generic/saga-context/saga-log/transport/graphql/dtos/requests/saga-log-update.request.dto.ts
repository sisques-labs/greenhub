import { Field, InputType } from '@nestjs/graphql';
import {
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
} from 'class-validator';
import { SagaLogTypeEnum } from '@/generic/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';

@InputType('SagaLogUpdateRequestDto')
export class SagaLogUpdateRequestDto {
	@Field(() => String, {
		description: 'The id of the saga log',
		nullable: false,
	})
	@IsUUID()
	@IsNotEmpty()
	id: string;

	@Field(() => SagaLogTypeEnum, {
		description: 'The type of the saga log',
		nullable: true,
	})
	@IsEnum(SagaLogTypeEnum)
	@IsOptional()
	type?: SagaLogTypeEnum;

	@Field(() => String, {
		description: 'The message of the saga log',
		nullable: true,
	})
	@IsString()
	@IsOptional()
	message?: string;
}
