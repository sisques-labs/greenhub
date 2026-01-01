import { QueryBus } from '@nestjs/cqrs';

import { OverviewFindViewModelQuery } from '@/generic/overview/application/queries/overview-find-view-model/overview-find-view-model.query';
import { OverviewViewModelFactory } from '@/generic/overview/domain/factories/view-models/plant-view-model/overview-view-model.factory';
import { OverviewViewModel } from '@/generic/overview/domain/view-models/plant/overview.view-model';
import { OverviewResponseDto } from '@/generic/overview/transport/graphql/dtos/responses/overview.response.dto';
import { OverviewGraphQLMapper } from '@/generic/overview/transport/graphql/mappers/overview.mapper';
import { OverviewQueriesResolver } from '@/generic/overview/transport/graphql/resolvers/overview-queries.resolver';

describe('OverviewQueriesResolver', () => {
	let resolver: OverviewQueriesResolver;
	let mockQueryBus: jest.Mocked<QueryBus>;
	let mockOverviewGraphQLMapper: jest.Mocked<OverviewGraphQLMapper>;
	let overviewViewModelFactory: OverviewViewModelFactory;

	beforeEach(() => {
		mockQueryBus = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<QueryBus>;

		mockOverviewGraphQLMapper = {
			toResponseDto: jest.fn(),
		} as unknown as jest.Mocked<OverviewGraphQLMapper>;

		overviewViewModelFactory = new OverviewViewModelFactory();

		resolver = new OverviewQueriesResolver(
			mockQueryBus,
			mockOverviewGraphQLMapper,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('overviewFind', () => {
		it('should return overview when found', async () => {
			const overviewId = 'overview';
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

			const viewModel = overviewViewModelFactory.create({
				id: overviewId,
				totalPlants: 150,
				totalActivePlants: 140,
				averagePlantsPerGrowingUnit: 6.0,
				plantsPlanted: 50,
				plantsGrowing: 60,
				plantsHarvested: 20,
				plantsDead: 5,
				plantsArchived: 15,
				plantsWithoutPlantedDate: 10,
				plantsWithNotes: 30,
				recentPlants: 25,
				totalGrowingUnits: 25,
				activeGrowingUnits: 20,
				emptyGrowingUnits: 5,
				growingUnitsPot: 10,
				growingUnitsGardenBed: 8,
				growingUnitsHangingBasket: 5,
				growingUnitsWindowBox: 2,
				totalCapacity: 250,
				totalCapacityUsed: 150,
				averageOccupancy: 60.0,
				growingUnitsAtLimit: 5,
				growingUnitsFull: 2,
				totalRemainingCapacity: 100,
				growingUnitsWithDimensions: 20,
				totalVolume: 50.5,
				averageVolume: 2.525,
				minPlantsPerGrowingUnit: 0,
				maxPlantsPerGrowingUnit: 10,
				medianPlantsPerGrowingUnit: 6.0,
				createdAt,
				updatedAt,
			});

			const responseDto: OverviewResponseDto = {
				id: overviewId,
				totalPlants: 150,
				totalActivePlants: 140,
				averagePlantsPerGrowingUnit: 6.0,
				plantsPlanted: 50,
				plantsGrowing: 60,
				plantsHarvested: 20,
				plantsDead: 5,
				plantsArchived: 15,
				plantsWithoutPlantedDate: 10,
				plantsWithNotes: 30,
				recentPlants: 25,
				totalGrowingUnits: 25,
				activeGrowingUnits: 20,
				emptyGrowingUnits: 5,
				growingUnitsPot: 10,
				growingUnitsGardenBed: 8,
				growingUnitsHangingBasket: 5,
				growingUnitsWindowBox: 2,
				totalCapacity: 250,
				totalCapacityUsed: 150,
				averageOccupancy: 60.0,
				growingUnitsAtLimit: 5,
				growingUnitsFull: 2,
				totalRemainingCapacity: 100,
				growingUnitsWithDimensions: 20,
				totalVolume: 50.5,
				averageVolume: 2.525,
				minPlantsPerGrowingUnit: 0,
				maxPlantsPerGrowingUnit: 10,
				medianPlantsPerGrowingUnit: 6.0,
				createdAt,
				updatedAt,
			};

			mockQueryBus.execute.mockResolvedValue(viewModel);
			mockOverviewGraphQLMapper.toResponseDto.mockReturnValue(responseDto);

			const result = await resolver.overviewFind();

			expect(result).toBe(responseDto);
			expect(mockQueryBus.execute).toHaveBeenCalledWith(
				expect.any(OverviewFindViewModelQuery),
			);
			const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
			expect(query).toBeInstanceOf(OverviewFindViewModelQuery);
			expect(mockOverviewGraphQLMapper.toResponseDto).toHaveBeenCalledWith(
				viewModel,
			);
		});

		it('should return null when overview not found', async () => {
			mockQueryBus.execute.mockResolvedValue(null);

			const result = await resolver.overviewFind();

			expect(result).toBeNull();
			expect(mockQueryBus.execute).toHaveBeenCalledWith(
				expect.any(OverviewFindViewModelQuery),
			);
			expect(mockOverviewGraphQLMapper.toResponseDto).not.toHaveBeenCalled();
		});
	});
});
