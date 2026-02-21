import { INumericRange } from '@/shared/domain/interfaces/numeric-range.interface';
import { BaseMongoDto } from '@/shared/infrastructure/database/mongodb/dtos/base-mongo.dto';

/**
 * Data Transfer Object for plant species documents stored in the MongoDB read database.
 *
 * @remarks
 * This DTO represents the structure of plant species documents in the MongoDB read database.
 * It matches the structure of PlantSpeciesViewModel for consistency.
 */
export type PlantSpeciesMongoDbDto = BaseMongoDto & {
	commonName: string;
	scientificName: string;
	family: string;
	description: string;
	category: string;
	difficulty: string;
	growthRate: string;
	lightRequirements: string;
	waterRequirements: string;
	temperatureRange: INumericRange;
	humidityRequirements: string;
	soilType: string;
	phRange: INumericRange;
	matureSize: { height: number; width: number };
	growthTime: number;
	tags: string[];
	isVerified: boolean;
	contributorId: string | null;
	deletedAt: Date | null;
};
