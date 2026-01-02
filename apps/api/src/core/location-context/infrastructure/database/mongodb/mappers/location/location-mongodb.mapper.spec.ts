import { LocationTypeEnum } from '@/core/location-context/domain/enums/location-type/location-type.enum';
import { LocationViewModelFactory } from '@/core/location-context/domain/factories/view-models/location-view-model/location-view-model.factory';
import { LocationViewModel } from '@/core/location-context/domain/view-models/location/location.view-model';
import { LocationMongoDbDto } from '@/core/location-context/infrastructure/database/mongodb/dtos/location/location-mongodb.dto';
import { LocationMongoDBMapper } from '@/core/location-context/infrastructure/database/mongodb/mappers/location/location-mongodb.mapper';

describe('LocationMongoDBMapper', () => {
	let mapper: LocationMongoDBMapper;
	let mockLocationViewModelFactory: jest.Mocked<LocationViewModelFactory>;

	beforeEach(() => {
		mockLocationViewModelFactory = {
			create: jest.fn(),
			fromAggregate: jest.fn(),
			fromPrimitives: jest.fn(),
		} as unknown as jest.Mocked<LocationViewModelFactory>;

		mapper = new LocationMongoDBMapper(mockLocationViewModelFactory);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('toViewModel', () => {
		it('should convert MongoDB document to view model with all properties', () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

			const mongoDoc: LocationMongoDbDto = {
				id: locationId,
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
				description: 'North-facing room with good sunlight',
				createdAt,
				updatedAt,
			};

			const viewModel = new LocationViewModel({
				id: locationId,
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
				description: 'North-facing room with good sunlight',
				createdAt,
				updatedAt,
			});

			mockLocationViewModelFactory.create.mockReturnValue(viewModel);

			const result = mapper.toViewModel(mongoDoc);

			expect(result).toBe(viewModel);
			expect(mockLocationViewModelFactory.create).toHaveBeenCalledWith({
				id: locationId,
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
				description: 'North-facing room with good sunlight',
				createdAt,
				updatedAt,
			});
		});

		it('should convert MongoDB document with null description', () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

			const mongoDoc: LocationMongoDbDto = {
				id: locationId,
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
				description: null,
				createdAt,
				updatedAt,
			};

			const viewModel = new LocationViewModel({
				id: locationId,
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
				description: null,
				createdAt,
				updatedAt,
			});

			mockLocationViewModelFactory.create.mockReturnValue(viewModel);

			const result = mapper.toViewModel(mongoDoc);

			expect(result).toBe(viewModel);
			expect(mockLocationViewModelFactory.create).toHaveBeenCalledWith({
				id: locationId,
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
				description: null,
				createdAt,
				updatedAt,
			});
		});

		it('should handle date conversion when createdAt/updatedAt are strings', () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const createdAt = '2024-01-01T00:00:00.000Z';
			const updatedAt = '2024-01-02T00:00:00.000Z';

			const mongoDoc: any = {
				id: locationId,
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
				description: 'North-facing room',
				createdAt,
				updatedAt,
			};

			const viewModel = new LocationViewModel({
				id: locationId,
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
				description: 'North-facing room',
				createdAt: new Date(createdAt),
				updatedAt: new Date(updatedAt),
			});

			mockLocationViewModelFactory.create.mockReturnValue(viewModel);

			const result = mapper.toViewModel(mongoDoc);

			expect(result).toBe(viewModel);
			expect(mockLocationViewModelFactory.create).toHaveBeenCalledWith({
				id: locationId,
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
				description: 'North-facing room',
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
			});
		});
	});

	describe('toMongoData', () => {
		it('should convert view model to MongoDB document with all properties', () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

			const viewModel = new LocationViewModel({
				id: locationId,
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
				description: 'North-facing room with good sunlight',
				createdAt,
				updatedAt,
			});

			const result = mapper.toMongoData(viewModel);

			expect(result).toEqual({
				id: locationId,
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
				description: 'North-facing room with good sunlight',
				createdAt,
				updatedAt,
			});
		});

		it('should convert view model with null description', () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

			const viewModel = new LocationViewModel({
				id: locationId,
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
				description: null,
				createdAt,
				updatedAt,
			});

			const result = mapper.toMongoData(viewModel);

			expect(result).toEqual({
				id: locationId,
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
				description: null,
				createdAt,
				updatedAt,
			});
		});
	});
});
