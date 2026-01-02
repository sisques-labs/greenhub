import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { LocationTypeEnum } from '@/core/location-context/domain/enums/location-type/location-type.enum';

@InputType('LocationCreateRequestDto')
export class LocationCreateRequestDto {
	@Field(() => String, { description: 'The name of the location' })
	@IsString()
	@IsNotEmpty()
	name: string;

	@Field(() => LocationTypeEnum, {
		description: 'The type of the location',
	})
	@IsEnum(LocationTypeEnum)
	@IsNotEmpty()
	type: LocationTypeEnum;

	@Field(() => String, {
		nullable: true,
		description: 'The description of the location',
	})
	@IsString()
	@IsOptional()
	description?: string | null;
}

