import { PlantSpeciesViewModel } from '@/core/plant-species-context/domain/view-models/plant-species/plant-species.view-model';
import { PlantSpeciesGraphQLMapper } from '@/core/plant-species-context/transport/graphql/mappers/plant-species/plant-species.mapper';

describe('PlantSpeciesGraphQLMapper', () => {
	let mapper: PlantSpeciesGraphQLMapper;

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
		tags: ['vegetable', 'tomato'],
		isVerified: true,
		contributorId: '223e4567-e89b-12d3-a456-426614174000',
		createdAt: new Date('2024-01-01'),
		updatedAt: new Date('2024-01-02'),
	};

	beforeEach(() => {
		mapper = new PlantSpeciesGraphQLMapper();
	});

	describe('toResponseDto', () => {
		it('should convert plant species view model to response DTO with all properties', () => {
			const viewModel = new PlantSpeciesViewModel(baseViewModelProps);

			const result = mapper.toResponseDto(viewModel);

			expect(result).toEqual({
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
				temperatureRange: { min: 15, max: 30 },
				humidityRequirements: baseViewModelProps.humidityRequirements,
				soilType: baseViewModelProps.soilType,
				phRange: { min: 6.0, max: 7.0 },
				matureSize: { height: 150, width: 60 },
				growthTime: baseViewModelProps.growthTime,
				tags: baseViewModelProps.tags,
				isVerified: baseViewModelProps.isVerified,
				contributorId: baseViewModelProps.contributorId,
				createdAt: baseViewModelProps.createdAt,
				updatedAt: baseViewModelProps.updatedAt,
			});
		});

		it('should convert plant species view model with null optional properties', () => {
			const viewModel = new PlantSpeciesViewModel({
				...baseViewModelProps,
				family: null,
				description: null,
				temperatureRange: null,
				humidityRequirements: null,
				soilType: null,
				phRange: null,
				matureSize: null,
				growthTime: null,
				tags: null,
				contributorId: null,
			});

			const result = mapper.toResponseDto(viewModel);

			expect(result.family).toBeNull();
			expect(result.description).toBeNull();
			expect(result.temperatureRange).toBeNull();
			expect(result.humidityRequirements).toBeNull();
			expect(result.soilType).toBeNull();
			expect(result.phRange).toBeNull();
			expect(result.matureSize).toBeNull();
			expect(result.growthTime).toBeNull();
			expect(result.tags).toBeNull();
			expect(result.contributorId).toBeNull();
		});

		it('should correctly map nested temperatureRange object', () => {
			const viewModel = new PlantSpeciesViewModel({
				...baseViewModelProps,
				temperatureRange: { min: 10, max: 35 },
			});

			const result = mapper.toResponseDto(viewModel);

			expect(result.temperatureRange).toEqual({ min: 10, max: 35 });
		});

		it('should correctly map nested phRange object', () => {
			const viewModel = new PlantSpeciesViewModel({
				...baseViewModelProps,
				phRange: { min: 5.5, max: 6.5 },
			});

			const result = mapper.toResponseDto(viewModel);

			expect(result.phRange).toEqual({ min: 5.5, max: 6.5 });
		});

		it('should correctly map nested matureSize object', () => {
			const viewModel = new PlantSpeciesViewModel({
				...baseViewModelProps,
				matureSize: { height: 200, width: 80 },
			});

			const result = mapper.toResponseDto(viewModel);

			expect(result.matureSize).toEqual({ height: 200, width: 80 });
		});
	});

	describe('toPaginatedResponseDto', () => {
		it('should convert paginated plant species result to paginated response DTO', () => {
			const viewModel = new PlantSpeciesViewModel(baseViewModelProps);
			const paginatedResult = {
				items: [viewModel],
				total: 1,
				page: 1,
				perPage: 10,
				totalPages: 1,
			};

			const result = mapper.toPaginatedResponseDto(paginatedResult);

			expect(result.total).toBe(1);
			expect(result.page).toBe(1);
			expect(result.perPage).toBe(10);
			expect(result.totalPages).toBe(1);
			expect(result.items).toHaveLength(1);
			expect(result.items[0].id).toBe(baseViewModelProps.id);
		});

		it('should return empty items array for empty paginated result', () => {
			const paginatedResult = {
				items: [],
				total: 0,
				page: 1,
				perPage: 10,
				totalPages: 0,
			};

			const result = mapper.toPaginatedResponseDto(paginatedResult);

			expect(result.items).toHaveLength(0);
			expect(result.total).toBe(0);
		});
	});
});
