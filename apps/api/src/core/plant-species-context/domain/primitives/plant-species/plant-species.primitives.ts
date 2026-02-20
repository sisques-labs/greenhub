import { INumericRange } from '@/shared/domain/interfaces/numeric-range.interface';

export type PlantSpeciesPrimitives = {
	id: string;
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
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;
};
