import { LocationViewModelFactory } from '@/core/plant-context/domain/factories/view-models/location-view-model/growing-unit-view-model.factory';
import { LocationViewModel } from '@/core/plant-context/domain/view-models/location/location.view-model';
import { LocationMongoDbDto } from '@/core/plant-context/infrastructure/database/mongodb/dtos/location/location-mongodb.dto';
import { Injectable, Logger } from '@nestjs/common';

/**
 * Mapper for converting between PlantViewModel domain entities and MongoDB documents.
 *
 * @remarks
 * This mapper handles the transformation between the domain layer (PlantViewModel) and the
 * MongoDB documents, ensuring proper conversion of dates and nullable fields.
 */
@Injectable()
export class LocationMongoDBMapper {
	private readonly logger = new Logger(LocationMongoDBMapper.name);

	constructor(
		private readonly locationViewModelFactory: LocationViewModelFactory,
	) {}

	/**
	 * Converts a MongoDB document to a location view model.
	 *
	 * @param doc - The MongoDB document to convert
	 * @returns The location view model
	 */
	public toViewModel(doc: LocationMongoDbDto): LocationViewModel {
		this.logger.log(
			`Converting MongoDB document to location view model with id ${doc.id}`,
		);

		return this.locationViewModelFactory.create({
			id: doc.id,
			name: doc.name,
			type: doc.type,
			description: doc.description,
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
	public toMongoData(locationViewModel: LocationViewModel): LocationMongoDbDto {
		this.logger.log(
			`Converting location view model with id ${locationViewModel.id} to MongoDB document`,
		);

		return {
			id: locationViewModel.id,
			name: locationViewModel.name,
			type: locationViewModel.type,
			description: locationViewModel.description,
			createdAt: locationViewModel.createdAt,
			updatedAt: locationViewModel.updatedAt,
		};
	}
}
