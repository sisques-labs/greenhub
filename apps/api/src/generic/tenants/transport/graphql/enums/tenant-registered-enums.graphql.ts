import { registerEnumType } from '@nestjs/graphql';

import { TenantStatusEnum } from '@/generic/tenants/domain/enums/tenant-status/tenant-status.enum';

/**
 * Registers all GraphQL enums for the tenant.
 * This file should be imported in the tenant module to ensure enums are registered before GraphQL schema generation.
 */
const registeredTenantEnums = [
	{
		enum: TenantStatusEnum,
		name: 'TenantStatusEnum',
		description: 'The status of the tenant',
	},
];

for (const {
	enum: enumType,
	name,
	description,
} of registeredTenantEnums) {
	registerEnumType(enumType, { name, description });
}

