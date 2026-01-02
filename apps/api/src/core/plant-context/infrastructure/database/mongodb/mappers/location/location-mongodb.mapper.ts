import { LocationViewModelBuilder } from '@/core/plant-context/domain/builders/location/location-view-model.builder';
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
		private readonly locationViewModelBuilder: LocationViewModelBuilder,
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

		// 01: Convert dates if needed
		const createdAt =
			doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt);
		const updatedAt =
			doc.updatedAt instanceof Date ? doc.updatedAt : new Date(doc.updatedAt);

		// 02: Build the location view model using the builder
		return this.locationViewModelBuilder
			.reset()
			.withId(doc.id)
			.withName(doc.name)
			.withType(doc.type)
			.withDescription(doc.description)
			.withCreatedAt(createdAt)
			.withUpdatedAt(updatedAt)
			.build();
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
