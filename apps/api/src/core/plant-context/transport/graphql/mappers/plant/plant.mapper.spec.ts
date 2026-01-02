import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';
import { LocationGraphQLMapper } from '@/core/plant-context/transport/graphql/mappers/location/location.mapper';
import { PlantGraphQLMapper } from '@/core/plant-context/transport/graphql/mappers/plant/plant.mapper';

describe('PlantGraphQLMapper', () => {
	let mapper: PlantGraphQLMapper;
	let mockLocationGraphQLMapper: jest.Mocked<LocationGraphQLMapper>;

	beforeEach(() => {
		mockLocationGraphQLMapper = {
			toResponseDtoFromViewModel: jest.fn(),
		} as unknown as jest.Mocked<LocationGraphQLMapper>;

		mapper = new PlantGraphQLMapper(mockLocationGraphQLMapper);
	});

	describe('toResponseDtoFromViewModel', () => {
		it('should convert plant view model to response DTO with all properties', () => {
			const plantId = '123e4567-e89b-12d3-a456-426614174000';
			const growingUnitId = '223e4567-e89b-12d3-a456-426614174000';
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');
			const plantedDate = new Date('2024-01-15');

			const viewModel = new PlantViewModel({
				id: plantId,
				growingUnitId: growingUnitId,
				name: 'Basil',
				species: 'Ocimum basilicum',
				plantedDate: plantedDate,
				notes: 'Keep in indirect sunlight',
				status: PlantStatusEnum.PLANTED,
				createdAt,
				updatedAt,
			});

			const result = mapper.toResponseDtoFromViewModel(viewModel);

			expect(result).toEqual({
				id: plantId,
				growingUnitId: growingUnitId,
				name: 'Basil',
				species: 'Ocimum basilicum',
				plantedDate: plantedDate,
				notes: 'Keep in indirect sunlight',
				status: PlantStatusEnum.PLANTED,
				createdAt,
				updatedAt,
			});
		});

		it('should convert plant view model with null optional properties', () => {
			const plantId = '123e4567-e89b-12d3-a456-426614174000';
			const growingUnitId = '223e4567-e89b-12d3-a456-426614174000';
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

			const viewModel = new PlantViewModel({
				id: plantId,
				growingUnitId: growingUnitId,
				name: 'Basil',
				species: 'Ocimum basilicum',
				plantedDate: null,
				notes: null,
				status: PlantStatusEnum.GROWING,
				createdAt,
				updatedAt,
			});

			const result = mapper.toResponseDtoFromViewModel(viewModel);

			expect(result).toEqual({
				id: plantId,
				growingUnitId: growingUnitId,
				name: 'Basil',
				species: 'Ocimum basilicum',
				plantedDate: null,
				notes: null,
				status: PlantStatusEnum.GROWING,
				createdAt,
				updatedAt,
			});
		});
	});
});
