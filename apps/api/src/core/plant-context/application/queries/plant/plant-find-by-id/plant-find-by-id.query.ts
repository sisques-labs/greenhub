import { IPlantFindByIdQueryDto } from '@/core/plant-context/application/dtos/queries/plant/plant-find-by-id/growing-unit-find-by-id.dto';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

/**
 * Query object used to find a plant by its unique identifier.
 *
 * @remarks
 * This class encapsulates the parameters needed to query a plant aggregate root by its ID.
 *
 * @public
 */
export class PlantFindByIdQuery {
	/**
	 * The unique identifier of the plant as a value object.
	 */
	readonly id: PlantUuidValueObject;

	/**
	 * Creates an instance of {@link PlantFindByIdQuery}.
	 *
	 * @param props - The data transfer object containing the plant ID.
	 */
	constructor(props: IPlantFindByIdQueryDto) {
		/**
		 * The plant ID provided in the query DTO,
		 * wrapped as a {@link PlantUuidValueObject}.
		 */
		this.id = new PlantUuidValueObject(props.id);
	}
}
