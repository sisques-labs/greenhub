import { IPlantSpeciesSearchQueryDto } from '@/core/plant-species-context/application/dtos/queries/plant-species/plant-species-search/plant-species-search.dto';

/**
 * Query for performing a full-text search on plant species.
 */
export class PlantSpeciesSearchQuery {
	readonly query: string;

	constructor(props: IPlantSpeciesSearchQueryDto) {
		this.query = props.query;
	}
}
