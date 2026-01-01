import { PlantEntity } from '@/core/plant-context/domain/entities/plant/plant.entity';
import { GrowingUnitCapacityValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-capacity/growing-unit-capacity.vo';
import { GrowingUnitNameValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-name/growing-unit-name.vo';
import { GrowingUnitTypeValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-type/growing-unit-type.vo';
import { DimensionsValueObject } from '@/shared/domain/value-objects/dimensions/dimensions.vo';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';

/**
 * Represents the structure required to create a new growing unit entity.
 *
 * @remarks
 * This interface defines the contract for all properties needed to instantiate a new GrowingUnit entity in the system.
 *
 * @public
 */
export interface IGrowingUnitDto {
	id: GrowingUnitUuidValueObject;
	name: GrowingUnitNameValueObject;
	type: GrowingUnitTypeValueObject;
	capacity: GrowingUnitCapacityValueObject;
	dimensions?: DimensionsValueObject | null;
	plants: PlantEntity[];
}
