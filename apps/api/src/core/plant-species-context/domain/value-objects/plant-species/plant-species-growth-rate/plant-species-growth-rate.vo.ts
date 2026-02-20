import { PlantSpeciesGrowthRateEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-growth-rate/plant-species-growth-rate.enum';
import { EnumValueObject } from '@/shared/domain/value-objects/enum/enum.vo';

export class PlantSpeciesGrowthRateValueObject extends EnumValueObject<
	typeof PlantSpeciesGrowthRateEnum
> {
	protected get enumObject(): typeof PlantSpeciesGrowthRateEnum {
		return PlantSpeciesGrowthRateEnum;
	}
}
