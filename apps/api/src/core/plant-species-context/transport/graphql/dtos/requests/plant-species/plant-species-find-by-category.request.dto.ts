import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty } from 'class-validator';

import { PlantSpeciesCategoryEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-category/plant-species-category.enum';

@InputType('PlantSpeciesFindByCategoryRequestDto')
export class PlantSpeciesFindByCategoryRequestDto {
	@Field(() => PlantSpeciesCategoryEnum, {
		description: 'The category to filter plant species by',
	})
	@IsEnum(PlantSpeciesCategoryEnum)
	@IsNotEmpty()
	category: PlantSpeciesCategoryEnum;
}
