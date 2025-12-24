import { PlantNameValueObject } from '@/features/plants/domain/value-objects/plant-name/plant-name.vo';
import { PlantNotesValueObject } from '@/features/plants/domain/value-objects/plant-notes/plant-notes.vo';
import { PlantPlantedDateValueObject } from '@/features/plants/domain/value-objects/plant-planted-date/plant-planted-date.vo';
import { PlantSpeciesValueObject } from '@/features/plants/domain/value-objects/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/features/plants/domain/value-objects/plant-status/plant-status.vo';
import { IBaseAggregateDto } from '@/shared/domain/interfaces/base-aggregate-dto.interface';
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
export interface IPlantCreateDto extends IBaseAggregateDto {
  id: PlantUuidValueObject;
  name: PlantNameValueObject;
  species: PlantSpeciesValueObject;
  plantedDate: PlantPlantedDateValueObject | null;
  notes: PlantNotesValueObject | null;
  status: PlantStatusValueObject;
}
