import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('TenantFindByIdRequestDto')
export class TenantFindByIdRequestDto {
	@Field(() => String, { description: 'The id of the tenant' })
	@IsUUID()
	@IsNotEmpty()
	id: string;
}

