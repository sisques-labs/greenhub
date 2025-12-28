import { ContainerNotFoundException } from '@/core/plant-context/containers/application/exceptions/container-not-found/container-not-found.exception';
import { ContainerAggregate } from '@/core/plant-context/containers/domain/aggregates/container.aggregate';
import { ContainerTypeEnum } from '@/core/plant-context/containers/domain/enums/container-type/container-type.enum';
import { ContainerNameValueObject } from '@/core/plant-context/containers/domain/value-objects/container-name/container-name.vo';
import { ContainerTypeValueObject } from '@/core/plant-context/containers/domain/value-objects/container-type/container-type.vo';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/container-uuid/container-uuid.vo';
import { Test } from '@nestjs/testing';
import { AssertContainerExistsService } from '../../services/assert-container-exists/assert-container-exists.service';
import { ContainerFindByIdQuery } from './container-find-by-id.query';
import { ContainerFindByIdQueryHandler } from './container-find-by-id.query-handler';

describe('ContainerFindByIdQueryHandler', () => {
  let handler: ContainerFindByIdQueryHandler;
  let mockAssertContainerExistsService: jest.Mocked<AssertContainerExistsService>;

  beforeEach(async () => {
    mockAssertContainerExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertContainerExistsService>;

    const module = await Test.createTestingModule({
      providers: [
        ContainerFindByIdQueryHandler,
        {
          provide: AssertContainerExistsService,
          useValue: mockAssertContainerExistsService,
        },
      ],
    }).compile();

    handler = module.get<ContainerFindByIdQueryHandler>(
      ContainerFindByIdQueryHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return container aggregate when container exists', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const query = new ContainerFindByIdQuery({ id: containerId });
      const now = new Date();
      const mockContainer = new ContainerAggregate(
        {
          id: new ContainerUuidValueObject(containerId),
          name: new ContainerNameValueObject('Garden Bed 1'),
          type: new ContainerTypeValueObject(ContainerTypeEnum.GARDEN_BED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockAssertContainerExistsService.execute.mockResolvedValue(mockContainer);

      const result = await handler.execute(query);

      expect(result).toBe(mockContainer);
      expect(mockAssertContainerExistsService.execute).toHaveBeenCalledWith(
        containerId,
      );
      expect(mockAssertContainerExistsService.execute).toHaveBeenCalledTimes(1);
    });

    it('should throw ContainerNotFoundException when container does not exist', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const query = new ContainerFindByIdQuery({ id: containerId });
      const error = new ContainerNotFoundException(containerId);

      mockAssertContainerExistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(query)).rejects.toThrow(error);
      expect(mockAssertContainerExistsService.execute).toHaveBeenCalledWith(
        containerId,
      );
    });
  });
});
