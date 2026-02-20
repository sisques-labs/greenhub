import { PlantSpeciesHumidityRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-humidity-requirements/plant-species-humidity-requirements.enum';
import { EnumValueObject } from '@/shared/domain/value-objects/enum/enum.vo';

export class PlantSpeciesHumidityRequirementsValueObject extends EnumValueObject<
	typeof PlantSpeciesHumidityRequirementsEnum
> {
	protected get enumObject(): typeof PlantSpeciesHumidityRequirementsEnum {
		return PlantSpeciesHumidityRequirementsEnum;
	}
}
