import { IGrowingUnitViewModelFindByIdQueryDto } from "@/core/plant-context/application/dtos/queries/growing-unit/growing-unit-view-model-find-by-id/growing-unit-view-model-find-by-id.dto";
import { GrowingUnitUuidValueObject } from "@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo";

/**
 * @class
 * @description
 * Represents a query for finding a growing unit view model by its unique identifier.
 *
 * @remarks
 * This query encapsulates the required data for retrieving a growing unit view model based on its ID.
 */
export class GrowingUnitViewModelFindByIdQuery {
	/**
	 * Unique identifier for the growing unit.
	 */
	readonly id: GrowingUnitUuidValueObject;

	/**
	 * Creates an instance of GrowingUnitViewModelFindByIdQuery.
	 *
	 * @param props - The data transfer object containing the growing unit's ID.
	 */
	constructor(props: IGrowingUnitViewModelFindByIdQueryDto) {
		this.id = new GrowingUnitUuidValueObject(props.id);
	}
}
