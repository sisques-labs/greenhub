import { Field, InputType } from '@nestjs/graphql';
import {
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
} from 'class-validator';

import { LocationTypeEnum } from '@/core/location-context/domain/enums/location-type/location-type.enum';

@InputType('LocationUpdateRequestDto')
export class LocationUpdateRequestDto {
	@Field(() => String, { description: 'The id of the location' })
	@IsUUID()
	@IsNotEmpty()
	id: string;

	@Field(() => String, {
		nullable: true,
		description: 'The name of the location',
	})
	@IsString()
	@IsOptional()
	name?: string;

	@Field(() => LocationTypeEnum, {
		nullable: true,
		description: 'The type of the location',
	})
	@IsEnum(LocationTypeEnum)
	@IsOptional()
	type?: LocationTypeEnum;

	@Field(() => String, {
		nullable: true,
		description: 'The description of the location',
	})
	@IsString()
	@IsOptional()
	description?: string | null;
}

