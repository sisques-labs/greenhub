import { LocationAggregate } from '@/core/location-context/domain/aggregates/location.aggregate';
import { LocationTypeEnum } from '@/core/location-context/domain/enums/location-type/location-type.enum';
import { LocationAggregateFactory } from '@/core/location-context/domain/factories/aggregates/location-aggregate/location-aggregate.factory';
import { LocationDescriptionValueObject } from '@/core/location-context/domain/value-objects/location/location-description/location-description.vo';
import { LocationNameValueObject } from '@/core/location-context/domain/value-objects/location/location-name/location-name.vo';
import { LocationTypeValueObject } from '@/core/location-context/domain/value-objects/location/location-type/location-type.vo';
import { LocationTypeormEntity } from '@/core/location-context/infrastructure/database/typeorm/entities/location-typeorm.entity';
import { LocationTypeormMapper } from '@/core/location-context/infrastructure/database/typeorm/mappers/location/location-typeorm.mapper';
import { LocationUuidValueObject } from '@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo';

describe('LocationTypeormMapper', () => {
	let mapper: LocationTypeormMapper;
	let mockLocationAggregateFactory: jest.Mocked<LocationAggregateFactory>;
	let locationAggregateFactory: LocationAggregateFactory;

	beforeEach(() => {
		locationAggregateFactory = new LocationAggregateFactory();

		mockLocationAggregateFactory = {
			create: jest.fn(),
			fromPrimitives: jest.fn(),
		} as unknown as jest.Mocked<LocationAggregateFactory>;

		mapper = new LocationTypeormMapper(mockLocationAggregateFactory);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('toDomainEntity', () => {
		it('should convert TypeORM entity to domain aggregate with all properties', () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const now = new Date();

			const typeormEntity = new LocationTypeormEntity();
			typeormEntity.id = locationId;
			typeormEntity.name = 'Living Room';
			typeormEntity.type = LocationTypeEnum.ROOM;
			typeormEntity.description = 'North-facing room with good sunlight';
			typeormEntity.createdAt = now;
			typeormEntity.updatedAt = now;
			typeormEntity.deletedAt = null;

			const locationAggregate = locationAggregateFactory.create({
				id: new LocationUuidValueObject(locationId),
				name: new LocationNameValueObject('Living Room'),
				type: new LocationTypeValueObject(LocationTypeEnum.ROOM),
				description: new LocationDescriptionValueObject(
					'North-facing room with good sunlight',
				),
			});

			mockLocationAggregateFactory.fromPrimitives.mockReturnValue(
				locationAggregate,
			);

			const result = mapper.toDomainEntity(typeormEntity);

			expect(result).toBe(locationAggregate);
			expect(mockLocationAggregateFactory.fromPrimitives).toHaveBeenCalledWith({
				id: locationId,
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
				description: 'North-facing room with good sunlight',
			});
		});

		it('should convert TypeORM entity with null description', () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const now = new Date();

			const typeormEntity = new LocationTypeormEntity();
			typeormEntity.id = locationId;
			typeormEntity.name = 'Living Room';
			typeormEntity.type = LocationTypeEnum.ROOM;
			typeormEntity.description = null;
			typeormEntity.createdAt = now;
			typeormEntity.updatedAt = now;
			typeormEntity.deletedAt = null;

			const locationAggregate = locationAggregateFactory.create({
				id: new LocationUuidValueObject(locationId),
				name: new LocationNameValueObject('Living Room'),
				type: new LocationTypeValueObject(LocationTypeEnum.ROOM),
				description: null,
			});

			mockLocationAggregateFactory.fromPrimitives.mockReturnValue(
				locationAggregate,
			);

			const result = mapper.toDomainEntity(typeormEntity);

			expect(result).toBe(locationAggregate);
			expect(mockLocationAggregateFactory.fromPrimitives).toHaveBeenCalledWith({
				id: locationId,
				name: 'Living Room',
				type: LocationTypeEnum.ROOM,
				description: null,
			});
		});
	});

	describe('toTypeormEntity', () => {
		it('should convert domain aggregate to TypeORM entity with all properties', () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';

			const locationAggregate = locationAggregateFactory.create({
				id: new LocationUuidValueObject(locationId),
				name: new LocationNameValueObject('Living Room'),
				type: new LocationTypeValueObject(LocationTypeEnum.ROOM),
				description: new LocationDescriptionValueObject(
					'North-facing room with good sunlight',
				),
			});

			const toPrimitivesSpy = jest
				.spyOn(locationAggregate, 'toPrimitives')
				.mockReturnValue({
					id: locationId,
					name: 'Living Room',
					type: LocationTypeEnum.ROOM,
					description: 'North-facing room with good sunlight',
				});

			const result = mapper.toTypeormEntity(locationAggregate);

			expect(result).toBeInstanceOf(LocationTypeormEntity);
			expect(result.id).toBe(locationId);
			expect(result.name).toBe('Living Room');
			expect(result.type).toBe(LocationTypeEnum.ROOM);
			expect(result.description).toBe('North-facing room with good sunlight');
			expect(toPrimitivesSpy).toHaveBeenCalledTimes(1);

			toPrimitivesSpy.mockRestore();
		});

		it('should convert domain aggregate with null description', () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';

			const locationAggregate = locationAggregateFactory.create({
				id: new LocationUuidValueObject(locationId),
				name: new LocationNameValueObject('Living Room'),
				type: new LocationTypeValueObject(LocationTypeEnum.ROOM),
				description: null,
			});

			const toPrimitivesSpy = jest
				.spyOn(locationAggregate, 'toPrimitives')
				.mockReturnValue({
					id: locationId,
					name: 'Living Room',
					type: LocationTypeEnum.ROOM,
					description: null,
				});

			const result = mapper.toTypeormEntity(locationAggregate);

			expect(result).toBeInstanceOf(LocationTypeormEntity);
			expect(result.id).toBe(locationId);
			expect(result.name).toBe('Living Room');
			expect(result.type).toBe(LocationTypeEnum.ROOM);
			expect(result.description).toBeNull();

			toPrimitivesSpy.mockRestore();
		});
	});
});

