import { PlantSpeciesFindByCriteriaQuery } from '@/core/plant-species-context/application/queries/plant-species/plant-species-find-by-criteria/plant-species-find-by-criteria.query';
import { PlantSpeciesFindByIdQuery } from '@/core/plant-species-context/application/queries/plant-species/plant-species-find-by-id/plant-species-find-by-id.query';
import { PlantSpeciesViewModel } from '@/core/plant-species-context/domain/view-models/plant-species/plant-species.view-model';
import { PlantSpeciesFindByIdRequestDto } from '@/core/plant-species-context/transport/graphql/dtos/requests/plant-species/plant-species-find-by-id.request.dto';
import { PlantSpeciesResponseDto } from '@/core/plant-species-context/transport/graphql/dtos/responses/plant-species/plant-species.response.dto';
import { PlantSpeciesGraphQLMapper } from '@/core/plant-species-context/transport/graphql/mappers/plant-species/plant-species.mapper';
import { PlantSpeciesQueriesResolver } from '@/core/plant-species-context/transport/graphql/resolvers/plant-species/plant-species-queries.resolver';
import { QueryBus } from '@nestjs/cqrs';

describe('PlantSpeciesQueriesResolver', () => {
	let resolver: PlantSpeciesQueriesResolver;
	let mockQueryBus: jest.Mocked<QueryBus>;
	let mockPlantSpeciesGraphQLMapper: jest.Mocked<PlantSpeciesGraphQLMapper>;

	const baseViewModelProps = {
		id: '123e4567-e89b-12d3-a456-426614174000',
		commonName: 'Tomato',
		scientificName: 'Solanum lycopersicum',
		family: 'Solanaceae',
		description: 'A common garden vegetable',
		category: 'VEGETABLE',
		difficulty: 'EASY',
		growthRate: 'FAST',
		lightRequirements: 'FULL_SUN',
		waterRequirements: 'HIGH',
		temperatureRange: { min: 15, max: 30 },
		humidityRequirements: 'MEDIUM',
		soilType: 'LOAMY',
		phRange: { min: 6.0, max: 7.0 },
		matureSize: { height: 150, width: 60 },
		growthTime: 80,
		tags: ['vegetable'],
		isVerified: true,
		contributorId: null,
		createdAt: new Date('2024-01-01'),
		updatedAt: new Date('2024-01-02'),
	};

	const baseResponseDto: PlantSpeciesResponseDto = {
		id: baseViewModelProps.id,
		commonName: baseViewModelProps.commonName,
		scientificName: baseViewModelProps.scientificName,
		family: baseViewModelProps.family,
		description: baseViewModelProps.description,
		category: baseViewModelProps.category,
		difficulty: baseViewModelProps.difficulty,
		growthRate: baseViewModelProps.growthRate,
		lightRequirements: baseViewModelProps.lightRequirements,
		waterRequirements: baseViewModelProps.waterRequirements,
		temperatureRange: baseViewModelProps.temperatureRange,
		humidityRequirements: baseViewModelProps.humidityRequirements,
		soilType: baseViewModelProps.soilType,
		phRange: baseViewModelProps.phRange,
		matureSize: baseViewModelProps.matureSize,
		growthTime: baseViewModelProps.growthTime,
		tags: baseViewModelProps.tags,
		isVerified: baseViewModelProps.isVerified,
		contributorId: baseViewModelProps.contributorId,
		createdAt: baseViewModelProps.createdAt,
		updatedAt: baseViewModelProps.updatedAt,
	};

	beforeEach(() => {
		mockQueryBus = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<QueryBus>;

		mockPlantSpeciesGraphQLMapper = {
			toResponseDto: jest.fn(),
			toPaginatedResponseDto: jest.fn(),
		} as unknown as jest.Mocked<PlantSpeciesGraphQLMapper>;

		resolver = new PlantSpeciesQueriesResolver(
			mockQueryBus,
			mockPlantSpeciesGraphQLMapper,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('plantSpeciesFindById', () => {
		it('should return plant species when found', async () => {
			const input: PlantSpeciesFindByIdRequestDto = {
				id: baseViewModelProps.id,
			};
			const viewModel = new PlantSpeciesViewModel(baseViewModelProps);

			mockQueryBus.execute.mockResolvedValue(viewModel);
			mockPlantSpeciesGraphQLMapper.toResponseDto.mockReturnValue(
				baseResponseDto,
			);

			const result = await resolver.plantSpeciesFindById(input);

			expect(result).toBe(baseResponseDto);
			expect(mockQueryBus.execute).toHaveBeenCalledWith(
				expect.any(PlantSpeciesFindByIdQuery),
			);
			const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
			expect(query).toBeInstanceOf(PlantSpeciesFindByIdQuery);
			expect(query.id.value).toBe(baseViewModelProps.id);
			expect(mockPlantSpeciesGraphQLMapper.toResponseDto).toHaveBeenCalledWith(
				viewModel,
			);
		});
	});

	describe('plantSpeciesFindByCriteria', () => {
		it('should return paginated plant species by criteria', async () => {
			const paginatedResult = {
				items: [new PlantSpeciesViewModel(baseViewModelProps)],
				total: 1,
				page: 1,
				perPage: 10,
				totalPages: 1,
			};
			const paginatedResponseDto = {
				items: [baseResponseDto],
				total: 1,
				page: 1,
				perPage: 10,
				totalPages: 1,
			};

			mockQueryBus.execute.mockResolvedValue(paginatedResult);
			mockPlantSpeciesGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
				paginatedResponseDto,
			);

			const result = await resolver.plantSpeciesFindByCriteria();

			expect(result).toBe(paginatedResponseDto);
			expect(mockQueryBus.execute).toHaveBeenCalledWith(
				expect.any(PlantSpeciesFindByCriteriaQuery),
			);
			expect(
				mockPlantSpeciesGraphQLMapper.toPaginatedResponseDto,
			).toHaveBeenCalledWith(paginatedResult);
		});
	});
});
