import { Field, InputType } from '@nestjs/graphql';
import {
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
} from 'class-validator';

import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';

@InputType('PlantAddRequestDto')
export class PlantAddRequestDto {
	@Field(() => String, {
		description: 'The id of the growing unit to add the plant to',
	})
	@IsUUID()
	@IsNotEmpty()
	growingUnitId: string;

	@Field(() => String, { description: 'The name of the plant' })
	@IsString()
	@IsNotEmpty()
	name: string;

	@Field(() => String, { description: 'The species of the plant' })
	@IsString()
	@IsNotEmpty()
	species: string;

	@Field(() => Date, {
		nullable: true,
		description: 'The date when the plant was planted',
	})
	@IsOptional()
	plantedDate?: Date | null;

	@Field(() => String, {
		nullable: true,
		description: 'Additional notes about the plant',
	})
	@IsString()
	@IsOptional()
	notes?: string | null;

	@Field(() => PlantStatusEnum, {
		nullable: true,
		description: 'The status of the plant. Defaults to PLANTED if not provided',
	})
	@IsEnum(PlantStatusEnum)
	@IsOptional()
	status?: PlantStatusEnum;
}
