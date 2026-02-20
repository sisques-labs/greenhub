import { PlantSpeciesCategoryEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-category/plant-species-category.enum';
import { EnumValueObject } from '@/shared/domain/value-objects/enum/enum.vo';

export class PlantSpeciesCategoryValueObject extends EnumValueObject<
	typeof PlantSpeciesCategoryEnum
> {
	protected get enumObject(): typeof PlantSpeciesCategoryEnum {
		return PlantSpeciesCategoryEnum;
	}
}
