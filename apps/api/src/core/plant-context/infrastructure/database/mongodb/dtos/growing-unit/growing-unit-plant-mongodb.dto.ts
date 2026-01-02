import { PlantMongoDbDto } from '@/core/plant-context/infrastructure/database/mongodb/dtos/plant/plant-mongodb.dto';

/**
 * Data Transfer Object for growing unit documents stored in the MongoDB read database.
 *
 * @remarks
 * This DTO represents the structure of growing unit documents in the MongoDB read database.
 * It matches the structure of GrowingUnitViewModel for consistency.
 */
export type GrowingUnitPlantMongoDbDto = Omit<
	PlantMongoDbDto,
	'growingUnitId'
> & {};
