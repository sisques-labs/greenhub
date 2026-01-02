import { PlantViewModelFindByIdQuery } from '@/core/plant-context/application/queries/plant/plant-view-model-find-by-id/plant-view-model-find-by-id.query';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';
import { PlantFindByIdRequestDto } from '@/core/plant-context/transport/graphql/dtos/requests/plant/plant-find-by-id.request.dto';
import { PlantResponseDto } from '@/core/plant-context/transport/graphql/dtos/responses/plant/plant.response.dto';
import { PlantGraphQLMapper } from '@/core/plant-context/transport/graphql/mappers/plant/plant.mapper';
import { PlantQueriesResolver } from '@/core/plant-context/transport/graphql/resolvers/plant/plant-queries.resolver';
import { QueryBus } from '@nestjs/cqrs';

describe('PlantQueriesResolver', () => {
	let resolver: PlantQueriesResolver;
	let mockQueryBus: jest.Mocked<QueryBus>;
	let mockPlantGraphQLMapper: jest.Mocked<PlantGraphQLMapper>;

	beforeEach(() => {
		mockQueryBus = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<QueryBus>;

		mockPlantGraphQLMapper = {
			toResponseDtoFromViewModel: jest.fn(),
			toPaginatedResponseDto: jest.fn(),
		} as unknown as jest.Mocked<PlantGraphQLMapper>;

		resolver = new PlantQueriesResolver(mockQueryBus, mockPlantGraphQLMapper);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('plantFindById', () => {
		it('should return plant when found', async () => {
			const plantId = '123e4567-e89b-12d3-a456-426614174000';
			const input: PlantFindByIdRequestDto = {
				id: plantId,
			};

			const plantViewModel = new PlantViewModel({
				id: plantId,
				growingUnitId: '223e4567-e89b-12d3-a456-426614174000',
				name: 'Basil',
				species: 'Ocimum basilicum',
				plantedDate: null,
				notes: null,
				status: PlantStatusEnum.PLANTED,
				createdAt: new Date(),
				updatedAt: new Date(),
			});

			const responseDto: PlantResponseDto = {
				id: plantId,
				growingUnitId: '223e4567-e89b-12d3-a456-426614174000',
				name: 'Basil',
				species: 'Ocimum basilicum',
				plantedDate: null,
				notes: null,
				status: PlantStatusEnum.PLANTED,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			mockQueryBus.execute.mockResolvedValue(plantViewModel);
			mockPlantGraphQLMapper.toResponseDtoFromViewModel.mockReturnValue(
				responseDto,
			);

			const result = await resolver.plantFindById(input);

			expect(result).toBe(responseDto);
			expect(mockQueryBus.execute).toHaveBeenCalledWith(
				expect.any(PlantViewModelFindByIdQuery),
			);
			const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
			expect(query).toBeInstanceOf(PlantViewModelFindByIdQuery);
			expect(query.id.value).toBe(plantId);
			expect(
				mockPlantGraphQLMapper.toResponseDtoFromViewModel,
			).toHaveBeenCalledWith(plantViewModel);
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
				expect.any(PlantViewModelFindByIdQuery),
			);
			expect(
				mockPlantGraphQLMapper.toResponseDtoFromViewModel,
			).not.toHaveBeenCalled();
		});
	});
});
