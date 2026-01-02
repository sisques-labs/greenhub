import { Injectable, Logger } from '@nestjs/common';

import { PlantEntity } from '@/core/plant-context/domain/entities/plant/plant.entity';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { PlantEntityFactory } from '@/core/plant-context/domain/factories/entities/plant/plant-entity.factory';
import { PlantPrimitives } from '@/core/plant-context/domain/primitives/plant/plant.primitives';
import { PlantTypeormEntity } from '@/core/plant-context/infrastructure/database/typeorm/entities/plant-typeorm.entity';

/**
 * Mapper for converting between PlantEntity domain entities and PlantTypeormEntity database entities.
 *
 * @remarks
 * This mapper handles the transformation between the domain layer (PlantEntity) and the
 * infrastructure layer (PlantTypeormEntity), ensuring proper conversion of value objects
 * and primitives.
 */
@Injectable()
export class PlantTypeormMapper {
	private readonly logger = new Logger(PlantTypeormMapper.name);

	constructor(private readonly plantEntityFactory: PlantEntityFactory) {}

	/**
	 * Converts a TypeORM entity to a plant entity.
	 *
	 * @param plantEntity - The TypeORM entity to convert
	 * @returns The plant entity
	 */
	toDomainEntity(plantEntity: PlantTypeormEntity): PlantEntity {
		this.logger.log(
			`Converting TypeORM entity to domain entity with id ${plantEntity.id}`,
		);

		return this.plantEntityFactory.fromPrimitives({
			id: plantEntity.id,
			growingUnitId: plantEntity.growingUnitId,
			name: plantEntity.name,
			species: plantEntity.species,
			plantedDate: plantEntity.plantedDate
				? new Date(plantEntity.plantedDate)
				: null,
			notes: plantEntity.notes,
			status: plantEntity.status,
		});
	}

	/**
	 * Converts a plant entity to a TypeORM entity.
	 *
	 * @param plantEntity - The plant entity to convert
	 * @returns The TypeORM entity
	 */
	toTypeormEntity(plantEntity: PlantEntity): PlantTypeormEntity {
		this.logger.log(
			`Converting domain entity with id ${plantEntity.id.value} to TypeORM entity`,
		);

		const primitives = plantEntity.toPrimitives();

		const entity = new PlantTypeormEntity();

		entity.id = primitives.id;
		entity.growingUnitId = primitives.growingUnitId;
		entity.name = primitives.name;
		entity.species = primitives.species;
		entity.plantedDate = primitives.plantedDate;
		entity.notes = primitives.notes;
		entity.status = primitives.status as PlantStatusEnum;

		return entity;
	}

	toTypeormEntityFromPrimitives(
		primitives: PlantPrimitives,
	): PlantTypeormEntity {
		this.logger.log(
			`Converting primitives to TypeORM entity with id ${primitives.id}`,
		);

		const entity = new PlantTypeormEntity();

		entity.id = primitives.id;
		entity.growingUnitId = primitives.growingUnitId;
		entity.name = primitives.name;
		entity.species = primitives.species;
		entity.plantedDate = primitives.plantedDate;
		entity.notes = primitives.notes;
		entity.status = primitives.status as PlantStatusEnum;

		return entity;
	}
}
