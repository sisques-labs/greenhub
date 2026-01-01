import { QueryBus } from '@nestjs/cqrs';

import { PlantFindByIdQuery } from '@/core/plant-context/application/queries/plant/plant-find-by-id/plant-find-by-id.query';
import { PlantEntity } from '@/core/plant-context/domain/entities/plant/plant.entity';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { PlantEntityFactory } from '@/core/plant-context/domain/factories/entities/plant/plant-entity.factory';
import { PlantNameValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-name/plant-name.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-status/plant-status.vo';
import { PlantFindByIdRequestDto } from '@/core/plant-context/transport/graphql/dtos/requests/plant/plant-find-by-id.request.dto';
import { PlantResponseDto } from '@/core/plant-context/transport/graphql/dtos/responses/plant/plant.response.dto';
import { PlantGraphQLMapper } from '@/core/plant-context/transport/graphql/mappers/plant/plant.mapper';
import { PlantQueriesResolver } from '@/core/plant-context/transport/graphql/resolvers/plant/plant-queries.resolver';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

describe('PlantQueriesResolver', () => {
	let resolver: PlantQueriesResolver;
	let mockQueryBus: jest.Mocked<QueryBus>;
	let mockPlantGraphQLMapper: jest.Mocked<PlantGraphQLMapper>;
	let plantEntityFactory: PlantEntityFactory;

	beforeEach(() => {
		mockQueryBus = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<QueryBus>;

		mockPlantGraphQLMapper = {
			toResponseDtoFromEntity: jest.fn(),
			toResponseDtoFromViewModel: jest.fn(),
		} as unknown as jest.Mocked<PlantGraphQLMapper>;

		plantEntityFactory = new PlantEntityFactory();

		resolver = new PlantQueriesResolver(mockQueryBus, mockPlantGraphQLMapper);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('plantFindById', () => {
		it('should return plant when found', async () => {
			const plantId = '123e4567-e89b-12d3-a456-426614174000';
			const growingUnitId = '223e4567-e89b-12d3-a456-426614174000';
			const input: PlantFindByIdRequestDto = {
				id: plantId,
			};

			const plantEntity = plantEntityFactory.create({
				id: new PlantUuidValueObject(plantId),
				growingUnitId: new GrowingUnitUuidValueObject(growingUnitId),
				name: new PlantNameValueObject('Basil'),
				species: new PlantSpeciesValueObject('Ocimum basilicum'),
				plantedDate: null,
				notes: null,
				status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
			});

			const responseDto: PlantResponseDto = {
				id: plantId,
				growingUnitId: growingUnitId,
				name: 'Basil',
				species: 'Ocimum basilicum',
				plantedDate: null,
				notes: null,
				status: PlantStatusEnum.PLANTED,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			mockQueryBus.execute.mockResolvedValue(plantEntity);
			mockPlantGraphQLMapper.toResponseDtoFromEntity.mockReturnValue(
				responseDto,
			);

			const result = await resolver.plantFindById(input);

			expect(result).toBe(responseDto);
			expect(mockQueryBus.execute).toHaveBeenCalledWith(
				expect.any(PlantFindByIdQuery),
			);
			const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
			expect(query).toBeInstanceOf(PlantFindByIdQuery);
			expect(query.id.value).toBe(plantId);
			expect(
				mockPlantGraphQLMapper.toResponseDtoFromEntity,
			).toHaveBeenCalledWith(plantEntity);
		});

		it('should return null when plant not found', async () => {
			const plantId = '123e4567-e89b-12d3-a456-426614174000';
			const input: PlantFindByIdRequestDto = {
				id: plantId,
			};

			mockQueryBus.execute.mockResolvedValue(null);

			const result = await resolver.plantFindById(input);

			expect(result).toBeNull();
			expect(mockQueryBus.execute).toHaveBeenCalledWith(
				expect.any(PlantFindByIdQuery),
			);
			expect(
				mockPlantGraphQLMapper.toResponseDtoFromEntity,
			).not.toHaveBeenCalled();
		});
	});
});

