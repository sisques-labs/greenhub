import { PlantSpeciesWaterRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-water-requirements/plant-species-water-requirements.enum';
import { EnumValueObject } from '@/shared/domain/value-objects/enum/enum.vo';

export class PlantSpeciesWaterRequirementsValueObject extends EnumValueObject<
	typeof PlantSpeciesWaterRequirementsEnum
> {
	protected get enumObject(): typeof PlantSpeciesWaterRequirementsEnum {
		return PlantSpeciesWaterRequirementsEnum;
	}
}
