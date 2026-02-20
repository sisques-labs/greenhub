import { PlantSpeciesLightRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-light-requirements/plant-species-light-requirements.enum';
import { EnumValueObject } from '@/shared/domain/value-objects/enum/enum.vo';

export class PlantSpeciesLightRequirementsValueObject extends EnumValueObject<
	typeof PlantSpeciesLightRequirementsEnum
> {
	protected get enumObject(): typeof PlantSpeciesLightRequirementsEnum {
		return PlantSpeciesLightRequirementsEnum;
	}
}
