import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { TenantStatusEnum } from '@/generic/tenants/domain/enums/tenant-status/tenant-status.enum';

@InputType('CreateTenantRequestDto')
export class CreateTenantRequestDto {
	@Field(() => String, {
		description: 'The Clerk ID of the tenant',
		nullable: false,
	})
	@IsString()
	@IsNotEmpty()
	clerkId: string;

	@Field(() => String, {
		description: 'The name of the tenant',
		nullable: false,
	})
	@IsString()
	@IsNotEmpty()
	name: string;

	@Field(() => TenantStatusEnum, {
		description: 'The status of the tenant',
		nullable: false,
	})
	@IsEnum(TenantStatusEnum)
	@IsNotEmpty()
	status: TenantStatusEnum;
}

