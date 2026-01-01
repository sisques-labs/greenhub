import { BaseMongoDto } from '@/shared/infrastructure/database/mongodb/dtos/base-mongo.dto';

/**
 * Data Transfer Object for location documents stored in the MongoDB read database.
 *
 * @remarks
 * This DTO represents the structure of location documents in the MongoDB read database.
 * It matches the structure of LocationViewModel for consistency.
 */
export type LocationMongoDbDto = BaseMongoDto & {
	name: string;
	type: string;
	description: string | null;
};
