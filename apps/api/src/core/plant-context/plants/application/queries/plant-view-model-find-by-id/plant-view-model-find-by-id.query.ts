import { IPlantFindByIdQueryDto } from '@/core/plant-context/plants/application/dtos/queries/find-plant-by-id/find-plant-by-id-query.dto';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

/**
 * Query for finding a plant view model by its ID.
 *
 * @remarks
 * This query encapsulates the plant ID needed to retrieve a plant view model.
 */
export class PlantViewModelFindByIdQuery {
  readonly id: PlantUuidValueObject;

  constructor(props: IPlantFindByIdQueryDto) {
    this.id = new PlantUuidValueObject(props.id);
  }
}
