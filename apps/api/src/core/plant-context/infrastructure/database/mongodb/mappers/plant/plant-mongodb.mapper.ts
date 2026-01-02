import { LocationViewModelBuilder } from '@/core/plant-context/domain/builders/location/location-view-model.builder';
import { PlantViewModelBuilder } from '@/core/plant-context/domain/builders/plant/plant-view-model.builder';
import { IPlantGrowingUnitReference } from '@/core/plant-context/domain/dtos/view-models/plant/plant-view-model.dto';
import { LocationViewModel } from '@/core/plant-context/domain/view-models/location/location.view-model';
import { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';
import { LocationMongoDbDto } from '@/core/plant-context/infrastructure/database/mongodb/dtos/location/location-mongodb.dto';
import {
	PlantGrowingUnitReferenceMongoDto,
	PlantMongoDbDto,
} from '@/core/plant-context/infrastructure/database/mongodb/dtos/plant/plant-mongodb.dto';
import { Injectable, Logger } from '@nestjs/common';

/**
 * Mapper for converting between PlantViewModel domain entities and MongoDB documents.
 *
 * @remarks
 * This mapper handles the transformation between the domain layer (PlantViewModel) and the
 * MongoDB documents, ensuring proper conversion of dates and nullable fields.
 */
@Injectable()
export class PlantMongoDBMapper {
	private readonly logger = new Logger(PlantMongoDBMapper.name);

	constructor(
		private readonly plantViewModelBuilder: PlantViewModelBuilder,
		private readonly locationViewModelBuilder: LocationViewModelBuilder,
	) {}

	/**
	 * Converts a MongoDB document to a plant view model.
	 *
	 * @param doc - The MongoDB document to convert
	 * @returns The plant view model
	 */
	public toViewModel(doc: PlantMongoDbDto): PlantViewModel {
		this.logger.log(
			`Converting MongoDB document to plant view model with id ${doc.id}`,
		);

		// 01: Convert dates if needed
		const createdAt =
			doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt);
		const updatedAt =
			doc.updatedAt instanceof Date ? doc.updatedAt : new Date(doc.updatedAt);
		const plantedDate = doc.plantedDate
			? doc.plantedDate instanceof Date
				? doc.plantedDate
				: new Date(doc.plantedDate)
			: null;

		// 02: Convert location if present
		const location = doc.location
			? this.toLocationViewModel(doc.location)
			: undefined;

		// 03: Convert growing unit reference if present
		const growingUnit = doc.growingUnit
			? this.toGrowingUnitReference(doc.growingUnit)
			: undefined;

		// 04: Build the plant view model using the builder
		const builder = this.plantViewModelBuilder
			.reset()
			.withId(doc.id)
			.withGrowingUnitId(doc.growingUnitId)
			.withName(doc.name)
			.withSpecies(doc.species)
			.withPlantedDate(plantedDate)
			.withNotes(doc.notes)
			.withStatus(doc.status)
			.withCreatedAt(createdAt)
			.withUpdatedAt(updatedAt);

		if (location) {
			builder.withLocation(location);
		}

		if (growingUnit) {
			builder.withGrowingUnit(growingUnit);
		}

		return builder.build();
	}

	/**
	 * Converts a plant view model to a MongoDB document.
	 *
	 * @param plantViewModel - The plant view model to convert
	 * @returns The MongoDB document
	 */
	public toMongoData(plantViewModel: PlantViewModel): PlantMongoDbDto {
		this.logger.log(
			`Converting plant view model with id ${plantViewModel.id} to MongoDB document`,
		);

		// 01: Convert location to MongoDB DTO if present
		const location = plantViewModel.location
			? this.toLocationMongoData(plantViewModel.location)
			: undefined;

		// 02: Convert growing unit reference to MongoDB DTO if present
		const growingUnit = plantViewModel.growingUnit
			? this.toGrowingUnitReferenceMongoData(plantViewModel.growingUnit)
			: undefined;

		return {
			id: plantViewModel.id,
			growingUnitId: plantViewModel.growingUnitId ?? '',
			name: plantViewModel.name,
			species: plantViewModel.species,
			plantedDate: plantViewModel.plantedDate,
			notes: plantViewModel.notes,
			status: plantViewModel.status,
			createdAt: plantViewModel.createdAt,
			updatedAt: plantViewModel.updatedAt,
			location,
			growingUnit,
		};
	}

	/**
	 * Converts a location view model to a MongoDB location DTO.
	 *
	 * @param location - The location view model to convert
	 * @returns The MongoDB location DTO
	 */
	private toLocationMongoData(location: LocationViewModel): LocationMongoDbDto {
		return {
			id: location.id,
			name: location.name,
			type: location.type,
			description: location.description,
			createdAt: location.createdAt,
			updatedAt: location.updatedAt,
		};
	}

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
	 * Converts a growing unit reference MongoDB DTO to a domain growing unit reference.
	 *
	 * @param growingUnit - The growing unit reference MongoDB DTO
	 * @returns The domain growing unit reference
	 */
	private toGrowingUnitReference(
		growingUnit: PlantGrowingUnitReferenceMongoDto,
	): IPlantGrowingUnitReference {
		return {
			id: growingUnit.id,
			name: growingUnit.name,
			type: growingUnit.type,
			capacity: growingUnit.capacity,
		};
	}

	/**
	 * Converts a domain growing unit reference to a MongoDB DTO.
	 *
	 * @param growingUnit - The domain growing unit reference
	 * @returns The growing unit reference MongoDB DTO
	 */
	private toGrowingUnitReferenceMongoData(
		growingUnit: IPlantGrowingUnitReference,
	): PlantGrowingUnitReferenceMongoDto {
		return {
			id: growingUnit.id,
			name: growingUnit.name,
			type: growingUnit.type,
			capacity: growingUnit.capacity,
		};
	}
}
