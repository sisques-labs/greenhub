import { Field, InputType } from "@nestjs/graphql";
import {
	IsDate,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
} from "class-validator";
import { SagaInstanceStatusEnum } from "@/generic/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum";

@InputType("SagaInstanceUpdateRequestDto")
export class SagaInstanceUpdateRequestDto {
	@Field(() => String, {
		description: "The id of the saga instance",
		nullable: false,
	})
	@IsUUID()
	@IsNotEmpty()
	id: string;

	@Field(() => String, {
		description: "The name of the saga instance",
		nullable: true,
	})
	@IsString()
	@IsOptional()
	name?: string;

	@Field(() => SagaInstanceStatusEnum, {
		description: "The status of the saga instance",
		nullable: true,
	})
	@IsEnum(SagaInstanceStatusEnum)
	@IsOptional()
	status?: SagaInstanceStatusEnum;

	@Field(() => Date, {
		description: "The start date of the saga instance",
		nullable: true,
	})
	@IsDate()
	@IsOptional()
	startDate?: Date | null;

	@Field(() => Date, {
		description: "The end date of the saga instance",
		nullable: true,
	})
	@IsDate()
	@IsOptional()
	endDate?: Date | null;
}
