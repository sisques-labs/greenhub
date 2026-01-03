import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('DeleteTenantRequestDto')
export class DeleteTenantRequestDto {
	@Field(() => String, { description: 'The unique identifier of the tenant' })
	@IsUUID()
	@IsNotEmpty()
	id: string;
}

