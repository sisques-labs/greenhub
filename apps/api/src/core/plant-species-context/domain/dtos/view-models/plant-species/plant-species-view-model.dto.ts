import { INumericRange } from '@/shared/domain/interfaces/numeric-range.interface';
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
	temperatureRange: INumericRange;
	humidityRequirements: string;
	soilType: string;
	phRange: INumericRange;
	matureSize: { height: number; width: number };
	growthTime: number;
	tags: string[];
	isVerified: boolean;
	contributorId: string | null;
}
