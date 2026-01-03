import { BaseMongoDto } from '@/shared/infrastructure/database/mongodb/dtos/base-mongo.dto';

/**
 * Data Transfer Object for tenant documents stored in the MongoDB read database.
 *
 * @remarks
 * This DTO represents the structure of tenant documents in the MongoDB read database.
 * It matches the structure of TenantViewModel for consistency.
 */
export type TenantMongoDbDto = BaseMongoDto & {
	clerkId: string;
	name: string;
	status: string;
};

