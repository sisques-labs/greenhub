import { IPlantSpeciesFindByCategoryQueryDto } from '@/core/plant-species-context/application/dtos/queries/plant-species/plant-species-find-by-category/plant-species-find-by-category.dto';
import { PlantSpeciesCategoryEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-category/plant-species-category.enum';
import { PlantSpeciesCategoryValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-category/plant-species-category.vo';

/**
 * Query for finding plant species view models by category.
 */
export class PlantSpeciesFindByCategoryQuery {
	readonly category: PlantSpeciesCategoryValueObject;

	constructor(props: IPlantSpeciesFindByCategoryQueryDto) {
		this.category = new PlantSpeciesCategoryValueObject(
			props.category as PlantSpeciesCategoryEnum,
		);
	}
}
