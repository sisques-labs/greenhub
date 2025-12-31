import { Injectable, Logger } from '@nestjs/common';
import { IPlantDto } from '@/core/plant-context/domain/dtos/entities/plant/plant.dto';
import { PlantEntity } from '@/core/plant-context/domain/entities/plant/plant.entity';
import { PlantPrimitives } from '@/core/plant-context/domain/primitives/plant.primitives';
import { PlantNameValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-name/plant-name.vo';
import { PlantNotesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-notes/plant-notes.vo';
import { PlantPlantedDateValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-planted-date/plant-planted-date.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-status/plant-status.vo';
import { IWriteFactory } from '@/shared/domain/interfaces/write-factory.interface';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

/**
 * Factory responsible for creating {@link PlantEntity} domain entities.
 *
 * @remarks
 * This factory encapsulates creation logic for `PlantEntity` using either
 * a data transfer object or primitive values. When constructing from primitives,
 * it maps and wraps the properties in their respective value objects to enforce
 * domain invariants.
 *
 * @example
 * ```ts
 * const plant = plantEntityFactory.create(dto);
 * const plantFromPrimitives = plantEntityFactory.fromPrimitives(primitives);
 * ```
 */
@Injectable()
export class PlantEntityFactory
	implements IWriteFactory<PlantEntity, IPlantDto>
{
	private readonly logger = new Logger(PlantEntityFactory.name);
	/**
	 * Creates a new {@link PlantEntity} using the provided plant DTO.
	 *
	 * @param data - The plant data transfer object containing initial property values.
	 * @returns A new PlantEntity instance constructed from the DTO.
	 */
	public create(data: IPlantDto): PlantEntity {
		this.logger.log(`Creating PlantEntity from DTO: ${JSON.stringify(data)}`);
		return new PlantEntity(data);
	}

	/**
	 * Creates a new {@link PlantEntity} from primitive properties by
	 * mapping them to value objects.
	 *
	 * @param data - An object containing primitive values for the plant entity.
	 * @param data.id - The Plant's unique identifier as a UUID string.
	 * @param data.growingUnitId - The identifier for the associated growing unit as a UUID string.
	 * @param data.name - The name of the plant.
	 * @param data.species - The species designation for the plant.
	 * @param data.plantedDate - (Optional) The date the plant was planted, in ISO string format.
	 * @param data.notes - (Optional) Additional notes regarding the plant.
	 * @param data.status - The current status code/label for the plant.
	 * @param data.createdAt - The creation date of the plant (unused here, but a part of primitives).
	 * @param data.updatedAt - The last updated date of the plant (unused here, but a part of primitives).
	 * @returns A new PlantEntity with value objects mapped from the provided primitives.
	 */
	public fromPrimitives(data: PlantPrimitives): PlantEntity {
		this.logger.log(
			`Creating PlantEntity from primitives: ${JSON.stringify(data)}`,
		);
		return new PlantEntity({
			id: new PlantUuidValueObject(data.id),
			growingUnitId: new GrowingUnitUuidValueObject(data.growingUnitId),
			name: new PlantNameValueObject(data.name),
			species: new PlantSpeciesValueObject(data.species),
			plantedDate: data.plantedDate
				? new PlantPlantedDateValueObject(data.plantedDate)
				: null,
			notes: data.notes ? new PlantNotesValueObject(data.notes) : null,
			status: new PlantStatusValueObject(data.status),
		});
	}
}
