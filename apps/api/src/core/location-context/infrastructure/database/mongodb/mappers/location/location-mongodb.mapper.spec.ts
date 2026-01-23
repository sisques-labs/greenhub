import { LocationTypeEnum } from '@/core/location-context/domain/enums/location-type/location-type.enum';
import { LocationViewModelBuilder } from '@/core/location-context/domain/builders/view-models/location-view-model/location-view-model.builder';
import { LocationViewModel } from '@/core/location-context/domain/view-models/location/location.view-model';
import { LocationMongoDbDto } from '@/core/location-context/infrastructure/database/mongodb/dtos/location/location-mongodb.dto';
import { LocationMongoDBMapper } from '@/core/location-context/infrastructure/database/mongodb/mappers/location/location-mongodb.mapper';

describe('LocationMongoDBMapper', () => {
	let mapper: LocationMongoDBMapper;
	let mockLocationViewModelBuilder: jest.Mocked<LocationViewModelBuilder>;

	beforeEach(() => {
		mockLocationViewModelBuilder = {
			withId: jest.fn().mockReturnThis(),
			withName: jest.fn().mockReturnThis(),
			withType: jest.fn().mockReturnThis(),
			withDescription: jest.fn().mockReturnThis(),
			withCreatedAt: jest.fn().mockReturnThis(),
			withUpdatedAt: jest.fn().mockReturnThis(),
			fromAggregate: jest.fn().mockReturnThis(),
			fromPrimitives: jest.fn().mockReturnThis(),
			build: jest.fn(),
		} as unknown as jest.Mocked<LocationViewModelBuilder>;

		mapper = new LocationMongoDBMapper(mockLocationViewModelBuilder);
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

			mockLocationViewModelBuilder.build.mockReturnValue(viewModel);

			const result = mapper.toViewModel(mongoDoc);

			expect(result).toBe(viewModel);
			expect(mockLocationViewModelBuilder.withId).toHaveBeenCalledWith(locationId);
			expect(mockLocationViewModelBuilder.withName).toHaveBeenCalledWith('Living Room');
			expect(mockLocationViewModelBuilder.withType).toHaveBeenCalledWith(LocationTypeEnum.ROOM);
			expect(mockLocationViewModelBuilder.withDescription).toHaveBeenCalledWith('North-facing room with good sunlight');
			expect(mockLocationViewModelBuilder.withCreatedAt).toHaveBeenCalledWith(createdAt);
			expect(mockLocationViewModelBuilder.withUpdatedAt).toHaveBeenCalledWith(updatedAt);
			expect(mockLocationViewModelBuilder.build).toHaveBeenCalled();
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

			mockLocationViewModelBuilder.build.mockReturnValue(viewModel);

			const result = mapper.toViewModel(mongoDoc);

			expect(result).toBe(viewModel);
			expect(mockLocationViewModelBuilder.withId).toHaveBeenCalledWith(locationId);
			expect(mockLocationViewModelBuilder.withName).toHaveBeenCalledWith('Living Room');
			expect(mockLocationViewModelBuilder.withType).toHaveBeenCalledWith(LocationTypeEnum.ROOM);
			expect(mockLocationViewModelBuilder.withDescription).toHaveBeenCalledWith(null);
			expect(mockLocationViewModelBuilder.withCreatedAt).toHaveBeenCalledWith(createdAt);
			expect(mockLocationViewModelBuilder.withUpdatedAt).toHaveBeenCalledWith(updatedAt);
			expect(mockLocationViewModelBuilder.build).toHaveBeenCalled();
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

			mockLocationViewModelBuilder.build.mockReturnValue(viewModel);

			const result = mapper.toViewModel(mongoDoc);

			expect(result).toBe(viewModel);
			expect(mockLocationViewModelBuilder.withId).toHaveBeenCalledWith(locationId);
			expect(mockLocationViewModelBuilder.withName).toHaveBeenCalledWith('Living Room');
			expect(mockLocationViewModelBuilder.withType).toHaveBeenCalledWith(LocationTypeEnum.ROOM);
			expect(mockLocationViewModelBuilder.withDescription).toHaveBeenCalledWith('North-facing room');
			expect(mockLocationViewModelBuilder.withCreatedAt).toHaveBeenCalledWith(expect.any(Date));
			expect(mockLocationViewModelBuilder.withUpdatedAt).toHaveBeenCalledWith(expect.any(Date));
			expect(mockLocationViewModelBuilder.build).toHaveBeenCalled();
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
