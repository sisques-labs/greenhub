import { IGrowingUnitFindByIdQueryDto } from '@/core/plant-context/application/dtos/queries/growing-unit/growing-unit-find-by-id/growing-unit-find-by-id.dto';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';

/**
 * Query object used to find a growing unit by its unique identifier.
 *
 * @remarks
 * This class encapsulates the parameters needed to query a growing unit aggregate root by its ID.
 *
 * @public
 */
export class GrowingUnitFindByIdQuery {
	/**
	 * The unique identifier of the growing unit as a value object.
	 */
	readonly id: GrowingUnitUuidValueObject;

	/**
	 * Creates an instance of {@link GrowingUnitFindByIdQuery}.
	 *
	 * @param props - The data transfer object containing the growing unit ID.
	 */
	constructor(props: IGrowingUnitFindByIdQueryDto) {
		/**
		 * The growing unit ID provided in the query DTO,
		 * wrapped as a {@link GrowingUnitUuidValueObject}.
		 */
		this.id = new GrowingUnitUuidValueObject(props.id);
	}
}
