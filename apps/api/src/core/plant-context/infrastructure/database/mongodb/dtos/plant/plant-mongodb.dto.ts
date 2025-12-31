import { BaseMongoDto } from '@/shared/infrastructure/database/mongodb/dtos/base-mongo.dto';

/**
 * Data Transfer Object for plant documents stored in the MongoDB read database.
 *
 * @remarks
 * This DTO represents the structure of plant documents in the MongoDB read database.
 * It matches the structure of PlantViewModel for consistency.
 */
export type PlantMongoDbDto = BaseMongoDto & {
	growingUnitId: string;
	name: string;
	species: string;
	plantedDate: Date | null;
	notes: string | null;
	status: string;
};
