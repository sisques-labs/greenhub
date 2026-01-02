import type { ILocationFindByIdQueryDto } from '@/core/location-context/application/dtos/queries/location/location-find-by-id/location-find-by-id.dto';
import { LocationFindByIdQuery } from '@/core/location-context/application/queries/location/location-find-by-id/location-find-by-id.query';
import { LocationFindByIdQueryHandler } from '@/core/location-context/application/queries/location/location-find-by-id/location-find-by-id.query-handler';
import type { AssertLocationExistsService } from '@/core/location-context/application/services/location/assert-location-exists/assert-location-exists.service';
import { LocationAggregate } from '@/core/location-context/domain/aggregates/location.aggregate';
import { LocationTypeEnum } from '@/core/location-context/domain/enums/location-type/location-type.enum';
import { LocationNameValueObject } from '@/core/location-context/domain/value-objects/location/location-name/location-name.vo';
import { LocationTypeValueObject } from '@/core/location-context/domain/value-objects/location/location-type/location-type.vo';
import { LocationUuidValueObject } from '@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo';

describe('LocationFindByIdQueryHandler', () => {
	let handler: LocationFindByIdQueryHandler;
	let mockAssertLocationExistsService: jest.Mocked<AssertLocationExistsService>;

	beforeEach(() => {
		mockAssertLocationExistsService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<AssertLocationExistsService>;

		handler = new LocationFindByIdQueryHandler(
			mockAssertLocationExistsService,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('execute', () => {
		it('should return location aggregate when found', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const queryDto: ILocationFindByIdQueryDto = {
				id: locationId,
			};

			const query = new LocationFindByIdQuery(queryDto);
			const mockLocation = new LocationAggregate({
				id: new LocationUuidValueObject(locationId),
				name: new LocationNameValueObject('Living Room'),
				type: new LocationTypeValueObject(LocationTypeEnum.ROOM),
				description: null,
			});

			mockAssertLocationExistsService.execute.mockResolvedValue(mockLocation);

			const result = await handler.execute(query);

			expect(result).toBe(mockLocation);
			expect(mockAssertLocationExistsService.execute).toHaveBeenCalledWith(
				locationId,
			);
			expect(mockAssertLocationExistsService.execute).toHaveBeenCalledTimes(1);
		});

		it('should throw exception when location does not exist', async () => {
			const locationId = '123e4567-e89b-12d3-a456-426614174000';
			const queryDto: ILocationFindByIdQueryDto = {
				id: locationId,
			};

			const query = new LocationFindByIdQuery(queryDto);
			const error = new Error('Location not found');

			mockAssertLocationExistsService.execute.mockRejectedValue(error);

			await expect(handler.execute(query)).rejects.toThrow(error);
			expect(mockAssertLocationExistsService.execute).toHaveBeenCalledWith(
				locationId,
			);
		});
	});
});

