import { PlantNameValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-name/plant-name.vo';
import { PlantNotesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-notes/plant-notes.vo';
import { PlantPlantedDateValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-planted-date/plant-planted-date.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-status/plant-status.vo';
import { IBaseAggregateDto } from '@/shared/domain/interfaces/base-aggregate-dto.interface';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

/**
 * Represents the structure required to create a new plant entity.
 *
 * @remarks
 * This interface defines the contract for all properties needed to instantiate a new Plant entity in the system.
 * It extends the {@link IBaseAggregateDto} interface for common aggregate root fields.
 *
 * @public
 */
export interface IPlantDto {
	id: PlantUuidValueObject;
	growingUnitId: GrowingUnitUuidValueObject;
	name: PlantNameValueObject;
	species: PlantSpeciesValueObject;
	plantedDate: PlantPlantedDateValueObject | null;
	notes: PlantNotesValueObject | null;
	status: PlantStatusValueObject;
}
