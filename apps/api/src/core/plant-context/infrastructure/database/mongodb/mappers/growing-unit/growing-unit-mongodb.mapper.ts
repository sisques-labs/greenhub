import { Injectable, Logger } from '@nestjs/common';

import { GrowingUnitViewModelFactory } from '@/core/plant-context/domain/factories/view-models/growing-unit-view-model/growing-unit-view-model.factory';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { GrowingUnitMongoDbDto } from '@/core/plant-context/infrastructure/database/mongodb/dtos/growing-unit/growing-unit-mongodb.dto copy';
import { PlantMongoDBMapper } from '@/core/plant-context/infrastructure/database/mongodb/mappers/plant/plant-mongodb.mapper';

/**
 * Mapper for converting between PlantViewModel domain entities and MongoDB documents.
 *
 * @remarks
 * This mapper handles the transformation between the domain layer (PlantViewModel) and the
 * MongoDB documents, ensuring proper conversion of dates and nullable fields.
 */
@Injectable()
export class GrowingUnitMongoDBMapper {
	private readonly logger = new Logger(GrowingUnitMongoDBMapper.name);

	constructor(
		private readonly growingUnitViewModelFactory: GrowingUnitViewModelFactory,
		private readonly plantMongoDBMapper: PlantMongoDBMapper,
	) {}

	/**
	 * Converts a MongoDB document to a plant view model.
	 *
	 * @param doc - The MongoDB document to convert
	 * @returns The growing unit view model
	 */
	public toViewModel(doc: GrowingUnitMongoDbDto): GrowingUnitViewModel {
		this.logger.log(
			`Converting MongoDB document to growing unit view model with id ${doc.id}`,
		);

		return this.growingUnitViewModelFactory.create({
			id: doc.id,
			name: doc.name,
			type: doc.type,
			capacity: doc.capacity,
			dimensions: doc.dimensions,
			plants: doc.plants.map((plant) =>
				this.plantMongoDBMapper.toViewModel(plant),
			),
			remainingCapacity: doc.remainingCapacity,
			numberOfPlants: doc.plants.length,
			volume: doc.volume,
			createdAt:
				doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt),
			updatedAt:
				doc.updatedAt instanceof Date ? doc.updatedAt : new Date(doc.updatedAt),
		});
	}

	/**
	 * Converts a plant view model to a MongoDB document.
	 *
	 * @param plantViewModel - The plant view model to convert
	 * @returns The MongoDB document
	 */
	public toMongoData(
		growingUnitViewModel: GrowingUnitViewModel,
	): GrowingUnitMongoDbDto {
		this.logger.log(
			`Converting growing unit view model with id ${growingUnitViewModel.id} to MongoDB document`,
		);

		return {
			id: growingUnitViewModel.id,
			name: growingUnitViewModel.name,
			type: growingUnitViewModel.type,
			capacity: growingUnitViewModel.capacity,
			dimensions: growingUnitViewModel.dimensions,
			plants: growingUnitViewModel.plants.map((plant) =>
				this.plantMongoDBMapper.toMongoData(plant),
			),
			remainingCapacity: growingUnitViewModel.remainingCapacity,
			numberOfPlants: growingUnitViewModel.numberOfPlants,
			volume: growingUnitViewModel.volume,
			createdAt: growingUnitViewModel.createdAt,
			updatedAt: growingUnitViewModel.updatedAt,
		};
	}
}
