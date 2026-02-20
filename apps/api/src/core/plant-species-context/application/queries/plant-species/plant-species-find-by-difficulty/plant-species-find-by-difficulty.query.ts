import { IPlantSpeciesFindByDifficultyQueryDto } from '@/core/plant-species-context/application/dtos/queries/plant-species/plant-species-find-by-difficulty/plant-species-find-by-difficulty.dto';
import { PlantSpeciesDifficultyEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-difficulty/plant-species-difficulty.enum';
import { PlantSpeciesDifficultyValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-difficulty/plant-species-difficulty.vo';

/**
 * Query for finding plant species view models by difficulty level.
 */
export class PlantSpeciesFindByDifficultyQuery {
	readonly difficulty: PlantSpeciesDifficultyValueObject;

	constructor(props: IPlantSpeciesFindByDifficultyQueryDto) {
		this.difficulty = new PlantSpeciesDifficultyValueObject(
			props.difficulty as PlantSpeciesDifficultyEnum,
		);
	}
}
