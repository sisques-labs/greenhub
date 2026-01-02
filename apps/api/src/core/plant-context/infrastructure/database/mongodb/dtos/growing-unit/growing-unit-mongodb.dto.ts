import { LocationMongoDbDto } from '@/core/plant-context/infrastructure/database/mongodb/dtos/location/location-mongodb.dto';
import { PlantMongoDbDto } from '@/core/plant-context/infrastructure/database/mongodb/dtos/plant/plant-mongodb.dto';
import { BaseMongoDto } from '@/shared/infrastructure/database/mongodb/dtos/base-mongo.dto';

/**
 * Data Transfer Object for growing unit documents stored in the MongoDB read database.
 *
 * @remarks
 * This DTO represents the structure of growing unit documents in the MongoDB read database.
 * It matches the structure of GrowingUnitViewModel for consistency.
 */
export type GrowingUnitMongoDbDto = BaseMongoDto & {
	location: LocationMongoDbDto;
	name: string;
	type: string;
	capacity: number;
	dimensions: {
		length: number;
		width: number;
		height: number;
		unit: string;
	} | null;
	plants: Omit<PlantMongoDbDto, 'growingUnitId'>[];
	remainingCapacity: number;
	numberOfPlants: number;
	volume: number;
};
