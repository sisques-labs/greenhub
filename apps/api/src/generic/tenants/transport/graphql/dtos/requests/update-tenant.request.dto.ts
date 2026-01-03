import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

import { TenantStatusEnum } from '@/generic/tenants/domain/enums/tenant-status/tenant-status.enum';

@InputType('UpdateTenantRequestDto')
export class UpdateTenantRequestDto {
	@Field(() => String, { description: 'The unique identifier of the tenant' })
	@IsUUID()
	@IsNotEmpty()
	id: string;

	@Field(() => String, {
		description: 'The name of the tenant',
		nullable: true,
	})
	@IsString()
	@IsOptional()
	name?: string;

	@Field(() => TenantStatusEnum, {
		description: 'The status of the tenant',
		nullable: true,
	})
	@IsEnum(TenantStatusEnum)
	@IsOptional()
	status?: TenantStatusEnum;
}

