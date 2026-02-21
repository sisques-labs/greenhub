import { Injectable, Logger } from '@nestjs/common';

import { PlantSpeciesViewModel } from '@/core/plant-species-context/domain/view-models/plant-species/plant-species.view-model';
import { PlantSpeciesMongoDbDto } from '@/core/plant-species-context/infrastructure/database/mongodb/dtos/plant-species/plant-species-mongodb.dto';

/**
 * Mapper for converting between PlantSpeciesViewModel domain entities and MongoDB documents.
 *
 * @remarks
 * This mapper handles the transformation between the domain layer (PlantSpeciesViewModel) and the
 * MongoDB documents, ensuring proper conversion of dates and nullable fields.
 */
@Injectable()
export class PlantSpeciesMongoDBMapper {
	private readonly logger = new Logger(PlantSpeciesMongoDBMapper.name);

	/**
	 * Converts a MongoDB document to a plant species view model.
	 *
	 * @param doc - The MongoDB document to convert
	 * @returns The plant species view model
	 */
	public toViewModel(doc: PlantSpeciesMongoDbDto): PlantSpeciesViewModel {
		this.logger.log(
			`Converting MongoDB document to plant species view model with id ${doc.id}`,
		);

		// 01: Convert dates if needed
		const createdAt =
			doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt);
		const updatedAt =
			doc.updatedAt instanceof Date ? doc.updatedAt : new Date(doc.updatedAt);

		// 02: Build and return the plant species view model
		return new PlantSpeciesViewModel({
			id: doc.id,
			commonName: doc.commonName,
			scientificName: doc.scientificName,
			family: doc.family,
			description: doc.description,
			category: doc.category,
			difficulty: doc.difficulty,
			growthRate: doc.growthRate,
			lightRequirements: doc.lightRequirements,
			waterRequirements: doc.waterRequirements,
			temperatureRange: doc.temperatureRange,
			humidityRequirements: doc.humidityRequirements,
			soilType: doc.soilType,
			phRange: doc.phRange,
			matureSize: doc.matureSize,
			growthTime: doc.growthTime,
			tags: doc.tags,
			isVerified: doc.isVerified,
			contributorId: doc.contributorId,
			createdAt,
			updatedAt,
		});
	}

	/**
	 * Converts a plant species view model to a MongoDB document.
	 *
	 * @param viewModel - The plant species view model to convert
	 * @returns The MongoDB document
	 */
	public toMongoData(viewModel: PlantSpeciesViewModel): PlantSpeciesMongoDbDto {
		this.logger.log(
			`Converting plant species view model with id ${viewModel.id} to MongoDB document`,
		);

		return {
			id: viewModel.id,
			commonName: viewModel.commonName,
			scientificName: viewModel.scientificName,
			family: viewModel.family,
			description: viewModel.description,
			category: viewModel.category,
			difficulty: viewModel.difficulty,
			growthRate: viewModel.growthRate,
			lightRequirements: viewModel.lightRequirements,
			waterRequirements: viewModel.waterRequirements,
			temperatureRange: viewModel.temperatureRange,
			humidityRequirements: viewModel.humidityRequirements,
			soilType: viewModel.soilType,
			phRange: viewModel.phRange,
			matureSize: viewModel.matureSize,
			growthTime: viewModel.growthTime,
			tags: viewModel.tags,
			isVerified: viewModel.isVerified,
			contributorId: viewModel.contributorId,
			createdAt: viewModel.createdAt,
			updatedAt: viewModel.updatedAt,
			deletedAt: null,
		};
	}
}
