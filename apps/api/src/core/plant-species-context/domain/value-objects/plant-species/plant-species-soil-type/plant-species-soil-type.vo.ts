import { PlantSpeciesSoilTypeEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-soil-type/plant-species-soil-type.enum';
import { EnumValueObject } from '@/shared/domain/value-objects/enum/enum.vo';

export class PlantSpeciesSoilTypeValueObject extends EnumValueObject<
	typeof PlantSpeciesSoilTypeEnum
> {
	protected get enumObject(): typeof PlantSpeciesSoilTypeEnum {
		return PlantSpeciesSoilTypeEnum;
	}
}
