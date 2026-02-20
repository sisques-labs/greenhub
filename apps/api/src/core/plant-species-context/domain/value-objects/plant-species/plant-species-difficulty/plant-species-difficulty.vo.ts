import { PlantSpeciesDifficultyEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-difficulty/plant-species-difficulty.enum';
import { EnumValueObject } from '@/shared/domain/value-objects/enum/enum.vo';

export class PlantSpeciesDifficultyValueObject extends EnumValueObject<
	typeof PlantSpeciesDifficultyEnum
> {
	protected get enumObject(): typeof PlantSpeciesDifficultyEnum {
		return PlantSpeciesDifficultyEnum;
	}
}
