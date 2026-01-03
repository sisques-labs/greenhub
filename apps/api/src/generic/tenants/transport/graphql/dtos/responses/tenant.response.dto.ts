import { Field, ObjectType } from '@nestjs/graphql';

import { BasePaginatedResultDto } from '@/shared/transport/graphql/dtos/responses/base-paginated-result/base-paginated-result.dto';

@ObjectType('TenantResponseDto')
export class TenantResponseDto {
	@Field(() => String, { description: 'The id of the tenant' })
	id: string;

	@Field(() => String, {
		description: 'The Clerk ID of the tenant',
		nullable: false,
	})
	clerkId: string;

	@Field(() => String, {
		nullable: true,
		description: 'The name of the tenant',
	})
	name?: string;

	@Field(() => String, {
		nullable: true,
		description: 'The status of the tenant',
	})
	status?: string;

	@Field(() => Date, {
		nullable: true,
		description: 'The created at of the tenant',
	})
	createdAt?: Date;

	@Field(() => Date, {
		nullable: true,
		description: 'The updated at of the tenant',
	})
	updatedAt?: Date;
}

@ObjectType('PaginatedTenantResultDto')
export class PaginatedTenantResultDto extends BasePaginatedResultDto {
	@Field(() => [TenantResponseDto], {
		description: 'The tenants in the current page',
	})
	items: TenantResponseDto[];
}

