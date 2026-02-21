import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty } from 'class-validator';

import { PlantSpeciesDifficultyEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-difficulty/plant-species-difficulty.enum';

@InputType('PlantSpeciesFindByDifficultyRequestDto')
export class PlantSpeciesFindByDifficultyRequestDto {
	@Field(() => PlantSpeciesDifficultyEnum, {
		description: 'The difficulty level to filter plant species by',
	})
	@IsEnum(PlantSpeciesDifficultyEnum)
	@IsNotEmpty()
	difficulty: PlantSpeciesDifficultyEnum;
}
