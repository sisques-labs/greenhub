import { IBaseViewModelDto } from '@/shared/domain/interfaces/base-view-model-dto.interface';

export interface IPlantSpeciesViewModelDto extends IBaseViewModelDto {
	commonName: string;
	scientificName: string;
	family: string;
	description: string;
	category: string;
	difficulty: string;
	growthRate: string;
	lightRequirements: string;
	waterRequirements: string;
	temperatureRange: { min: number; max: number };
	humidityRequirements: string;
	soilType: string;
	phRange: { min: number; max: number };
	matureSize: { height: number; width: number };
	growthTime: number;
	tags: string[];
	isVerified: boolean;
	contributorId: string | null;
}
