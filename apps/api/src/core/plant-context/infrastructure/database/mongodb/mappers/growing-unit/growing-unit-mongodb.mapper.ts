import { GrowingUnitViewModelBuilder } from '@/core/plant-context/domain/builders/growing-unit/growing-unit-view-model.builder';
import { LocationViewModelBuilder } from '@/core/plant-context/domain/builders/location/location-view-model.builder';
import { PlantViewModelBuilder } from '@/core/plant-context/domain/builders/plant/plant-view-model.builder';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { LocationViewModel } from '@/core/plant-context/domain/view-models/location/location.view-model';
import { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';
import { GrowingUnitMongoDbDto } from '@/core/plant-context/infrastructure/database/mongodb/dtos/growing-unit/growing-unit-mongodb.dto';
import { GrowingUnitPlantMongoDbDto } from '@/core/plant-context/infrastructure/database/mongodb/dtos/growing-unit/growing-unit-plant-mongodb.dto';
import { LocationMongoDbDto } from '@/core/plant-context/infrastructure/database/mongodb/dtos/location/location-mongodb.dto';
import { LocationMongoDBMapper } from '@/core/plant-context/infrastructure/database/mongodb/mappers/location/location-mongodb.mapper';
import { PlantMongoDBMapper } from '@/core/plant-context/infrastructure/database/mongodb/mappers/plant/plant-mongodb.mapper';
import { Injectable, Logger } from '@nestjs/common';

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
		private readonly plantMongoDBMapper: PlantMongoDBMapper,
		private readonly locationMongoDBMapper: LocationMongoDBMapper,
		private readonly growingUnitViewModelBuilder: GrowingUnitViewModelBuilder,
		private readonly plantViewModelBuilder: PlantViewModelBuilder,
		private readonly locationViewModelBuilder: LocationViewModelBuilder,
	) {}

	/**
	 * Converts a location MongoDB document to a location view model.
	 *
	 * @param location - The location MongoDB document to convert
	 * @returns The location view model
	 */
	private toLocationViewModel(location: LocationMongoDbDto): LocationViewModel {
		// 01: Convert dates if needed
		const createdAt =
			location.createdAt instanceof Date
				? location.createdAt
				: new Date(location.createdAt);
		const updatedAt =
			location.updatedAt instanceof Date
				? location.updatedAt
				: new Date(location.updatedAt);

		// 02: Build the location view model using the builder
		return this.locationViewModelBuilder
			.reset()
			.withId(location.id)
			.withName(location.name)
			.withType(location.type)
			.withDescription(location.description)
			.withCreatedAt(createdAt)
			.withUpdatedAt(updatedAt)
			.build();
	}

	/**
	 * Converts a growing unit plant MongoDB document to a plant view model.
	 *
	 * @param plant - The growing unit plant MongoDB document to convert
	 * @param growingUnitId - The growing unit id to associate with the plant
	 * @returns The plant view model
	 */
	private toGrowingUnitPlantViewModel(
		plant: GrowingUnitPlantMongoDbDto,
	): PlantViewModel {
		// 01: Convert dates if needed
		const createdAt =
			plant.createdAt instanceof Date
				? plant.createdAt
				: new Date(plant.createdAt);
		const updatedAt =
			plant.updatedAt instanceof Date
				? plant.updatedAt
				: new Date(plant.updatedAt);
		const plantedDate = plant.plantedDate
			? plant.plantedDate instanceof Date
				? plant.plantedDate
				: new Date(plant.plantedDate)
			: null;

		// 02: Build the plant view model using the builder
		return this.plantViewModelBuilder
			.reset()
			.withId(plant.id)
			.withName(plant.name)
			.withSpecies(plant.species)
			.withPlantedDate(plantedDate)
			.withNotes(plant.notes)
			.withStatus(plant.status)
			.withCreatedAt(createdAt)
			.withUpdatedAt(updatedAt)
			.build();
	}

	/**
	 * Converts a MongoDB document to a growing unit view model.
	 *
	 * @param doc - The MongoDB document to convert
	 * @returns The growing unit view model
	 */
	public toViewModel(doc: GrowingUnitMongoDbDto): GrowingUnitViewModel {
		this.logger.log(
			`Converting MongoDB document to growing unit view model with id ${doc.id}`,
		);

		// 01: Convert location MongoDB document to view model
		const locationViewModel = this.toLocationViewModel(doc.location);

		// 02: Convert plants MongoDB documents to view models
		const plantViewModels = doc.plants.map((plant) =>
			this.toGrowingUnitPlantViewModel(plant),
		);

		// 03: Convert dates if needed
		const createdAt =
			doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt);
		const updatedAt =
			doc.updatedAt instanceof Date ? doc.updatedAt : new Date(doc.updatedAt);

		// 04: Build the growing unit view model using the builder
		return this.growingUnitViewModelBuilder
			.reset()
			.withId(doc.id)
			.withLocation(locationViewModel)
			.withName(doc.name)
			.withType(doc.type)
			.withCapacity(doc.capacity)
			.withDimensions(doc.dimensions)
			.withPlants(plantViewModels)
			.withRemainingCapacity(doc.remainingCapacity)
			.withNumberOfPlants(doc.numberOfPlants)
			.withVolume(doc.volume)
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
	public toMongoData(
		growingUnitViewModel: GrowingUnitViewModel,
	): GrowingUnitMongoDbDto {
		this.logger.log(
			`Converting growing unit view model with id ${growingUnitViewModel.id} to MongoDB document`,
		);

		const plants = growingUnitViewModel.plants.map((plant) => {
			const { growingUnitId, ...plantMongoData } =
				this.plantMongoDBMapper.toMongoData(plant);
			return plantMongoData;
		});

		return {
			id: growingUnitViewModel.id,
			location: this.locationMongoDBMapper.toMongoData(
				growingUnitViewModel.location,
			),
			name: growingUnitViewModel.name,
			type: growingUnitViewModel.type,
			capacity: growingUnitViewModel.capacity,
			dimensions: growingUnitViewModel.dimensions,
			plants: plants,
			remainingCapacity: growingUnitViewModel.remainingCapacity,
			numberOfPlants: growingUnitViewModel.numberOfPlants,
			volume: growingUnitViewModel.volume,
			createdAt: growingUnitViewModel.createdAt,
			updatedAt: growingUnitViewModel.updatedAt,
		};
	}
}
