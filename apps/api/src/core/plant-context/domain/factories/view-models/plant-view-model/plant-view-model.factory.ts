import { Injectable, Logger } from '@nestjs/common';

import { IPlantViewModelDto } from '@/core/plant-context/domain/dtos/view-models/plant/plant-view-model.dto';
import { PlantEntity } from '@/core/plant-context/domain/entities/plant/plant.entity';
import { PlantPrimitives } from '@/core/plant-context/domain/primitives/plant/plant.primitives';
import { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';
import { IReadFactory } from '@/shared/domain/interfaces/read-factory.interface';

/**
 * Factory class responsible for creating {@link PlantViewModel} instances from different sources
 * such as DTOs, primitives, and aggregates. This promotes a consistent approach for transforming
 * domain or persistence layer data into a view model suitable for presentation or API response.
 *
 * @remarks
 * Implements {@link IReadFactory} to standardize transformation methods for the plant context.
 *
 * @example
 * const factory = new PlantViewModelFactory();
 * const viewModel = factory.fromAggregate(plantAggregate);
 */
@Injectable()
export class PlantViewModelFactory
	implements
		IReadFactory<
			PlantViewModel,
			IPlantViewModelDto,
			PlantEntity,
			PlantPrimitives
		>
{
	private readonly logger = new Logger(PlantViewModelFactory.name);

	/**
	 * Creates a new {@link PlantViewModel} instance from an {@link IPlantCreateViewModelDto}.
	 *
	 * @param data - The DTO containing plant creation data.
	 * @returns The corresponding {@link PlantViewModel} instance.
	 *
	 * @example
	 * const dto: IPlantCreateViewModelDto = {...};
	 * const viewModel = factory.create(dto);
	 */
	public create(data: IPlantViewModelDto): PlantViewModel {
		this.logger.log(
			`Creating plant view model from DTO: ${JSON.stringify(data)}`,
		);
		return new PlantViewModel(data);
	}

	/**
	 * Creates a {@link PlantViewModel} instance from a set of plant primitives.
	 *
	 * @param plantPrimitives - The primitives object representing low-level plant data.
	 * @returns The constructed {@link PlantViewModel}.
	 *
	 * @example
	 * const primitives: PlantPrimitives = {...};
	 * const viewModel = factory.fromPrimitives(primitives);
	 */
	public fromPrimitives(data: PlantPrimitives): PlantViewModel {
		this.logger.log(
			`Creating plant view model from primitives: ${JSON.stringify(data)}`,
		);

		const now = new Date();

		return new PlantViewModel({
			id: data.id,
			growingUnitId: data.growingUnitId,
			name: data.name,
			species: data.species,
			plantedDate: data.plantedDate,
			notes: data.notes,
			status: data.status,
			createdAt: now,
			updatedAt: now,
		});
	}

	/**
	 * Creates a {@link PlantViewModel} instance from a {@link PlantAggregate}.
	 *
	 * @param plantAggregate - The aggregate root containing the plant domain entity.
	 * @returns A {@link PlantViewModel} populated from the aggregate.
	 *
	 * @example
	 * const viewModel = factory.fromAggregate(plantAggregate);
	 */
	public fromAggregate(plantEntity: PlantEntity): PlantViewModel {
		this.logger.log(`Creating plant view model from aggregate: ${plantEntity}`);

		const now = new Date();

		return new PlantViewModel({
			id: plantEntity.id.value,
			growingUnitId: plantEntity.growingUnitId.value,
			name: plantEntity.name.value,
			species: plantEntity.species.value,
			plantedDate: plantEntity.plantedDate?.value ?? null,
			notes: plantEntity.notes?.value ?? null,
			status: plantEntity.status.value,
			createdAt: now,
			updatedAt: now,
		});
	}
}
