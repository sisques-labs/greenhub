import { BaseMongoDto } from '@/shared/infrastructure/database/mongodb/dtos/base-mongo.dto';
import { LocationMongoDbDto } from '@/core/plant-context/infrastructure/database/mongodb/dtos/location/location-mongodb.dto';

/**
 * Represents a simplified growing unit reference for plant MongoDB documents.
 * Contains only basic information without the plants array to avoid circular references.
 */
export type PlantGrowingUnitReferenceMongoDto = {
	id: string;
	name: string;
	type: string;
	capacity: number;
};

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
	location?: LocationMongoDbDto;
	growingUnit?: PlantGrowingUnitReferenceMongoDto;
};
