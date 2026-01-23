import { LocationTypeEnum } from '@/core/location-context/domain/enums/location-type/location-type.enum';
import { LocationAggregateBuilder } from '@/core/location-context/domain/builders/aggregates/location-aggregate/location-aggregate.builder';
import { LocationNameValueObject } from '@/core/location-context/domain/value-objects/location/location-name/location-name.vo';
import { LocationTypeValueObject } from '@/core/location-context/domain/value-objects/location/location-type/location-type.vo';
import { LocationTypeormEntity } from '@/core/location-context/infrastructure/database/typeorm/entities/location-typeorm.entity';
import { LocationTypeormMapper } from '@/core/location-context/infrastructure/database/typeorm/mappers/location/location-typeorm.mapper';
import { LocationTypeormRepository } from '@/core/location-context/infrastructure/database/typeorm/repositories/location/location-typeorm.repository';
import { LocationUuidValueObject } from '@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { Repository } from 'typeorm';

describe('LocationTypeormRepository', () => {
	let repository: LocationTypeormRepository;
	let mockTypeormMasterService: jest.Mocked<TypeormMasterService>;
	let mockLocationTypeormMapper: jest.Mocked<LocationTypeormMapper>;
	let mockTypeormRepository: jest.Mocked<Repository<LocationTypeormEntity>>;
	let mockFindOne: jest.Mock;
	let mockSave: jest.Mock;
	let mockSoftDelete: jest.Mock;
	let locationAggregateBuilder: LocationAggregateBuilder;

	beforeEach(() => {
		mockFindOne = jest.fn();
		mockSave = jest.fn();
		mockSoftDelete = jest.fn();

		mockTypeormRepository = {
			findOne: mockFindOne,
			save: mockSave,
			softDelete: mockSoftDelete,
		} as unknown as jest.Mocked<Repository<LocationTypeormEntity>>;

		mockTypeormMasterService = {
			getRepository: jest.fn().mockReturnValue(mockTypeormRepository),
		} as unknown as jest.Mocked<TypeormMasterService>;

		mockLocationTypeormMapper = {
			toDomainEntity: jest.fn(),
			toTypeormEntity: jest.fn(),
		} as unknown as jest.Mocked<LocationTypeormMapper>;

		locationAggregateBuilder = new LocationAggregateBuilder();

		repository = new LocationTypeormRepository(
			mockTypeormMasterService,
			mockLocationTypeormMapper,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('findById', () => {
		it('should return location aggregate when location exists', async () => {
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

			const locationAggregate = locationAggregateBuilder
				.withId(new LocationUuidValueObject(locationId))
				.withName(new LocationNameValueObject('Living Room'))
				.withType(new LocationTypeValueObject(LocationTypeEnum.ROOM))
				.withDescription(null)
				.build();

			mockFindOne.mockResolvedValue(typeormEntity);
			mockLocationTypeormMapper.toDomainEntity.mockReturnValue(
				locationAggregate,
			);

			const result = await repository.findById(locationId);

			expect(result).toBe(locationAggregate);
			expect(mockFindOne).toHaveBeenCalledWith({
				where: { id: locationId },
			});
			expect(mockLocationTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
				typeormEntity,
			);
			expect(mockLocationTypeormMapper.toDomainEntity).toHaveBeenCalledTimes(1);
		});

		it('should return null when location does not exist', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';

			mockFindOne.mockResolvedValue(null);

			const result = await repository.findById(locationId);

			expect(result).toBeNull();
			expect(mockFindOne).toHaveBeenCalledWith({
				where: { id: locationId },
			});
			expect(mockLocationTypeormMapper.toDomainEntity).not.toHaveBeenCalled();
		});
	});

	describe('save', () => {
		it('should save location aggregate and return it', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const now = new Date();

			const locationAggregate = locationAggregateBuilder
				.withId(new LocationUuidValueObject(locationId))
				.withName(new LocationNameValueObject('Living Room'))
				.withType(new LocationTypeValueObject(LocationTypeEnum.ROOM))
				.withDescription(null)
				.build();

			const typeormEntity = new LocationTypeormEntity();
			typeormEntity.id = locationId;
			typeormEntity.name = 'Living Room';
			typeormEntity.type = LocationTypeEnum.ROOM;
			typeormEntity.description = null;
			typeormEntity.createdAt = now;
			typeormEntity.updatedAt = now;
			typeormEntity.deletedAt = null;

			const savedEntity = new LocationTypeormEntity();
			Object.assign(savedEntity, typeormEntity);

			mockLocationTypeormMapper.toTypeormEntity.mockReturnValue(typeormEntity);
			mockSave.mockResolvedValue(savedEntity);
			mockLocationTypeormMapper.toDomainEntity.mockReturnValue(
				locationAggregate,
			);

			const result = await repository.save(locationAggregate);

			expect(result).toBe(locationAggregate);
			expect(mockLocationTypeormMapper.toTypeormEntity).toHaveBeenCalledWith(
				locationAggregate,
			);
			expect(mockSave).toHaveBeenCalledWith(typeormEntity);
			expect(mockLocationTypeormMapper.toDomainEntity).toHaveBeenCalledWith(
				savedEntity,
			);
		});
	});

	describe('delete', () => {
		it('should soft delete location by id', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';

			mockSoftDelete.mockResolvedValue(undefined);

			await repository.delete(locationId);

			expect(mockSoftDelete).toHaveBeenCalledWith(locationId);
			expect(mockSoftDelete).toHaveBeenCalledTimes(1);
		});
	});
});



