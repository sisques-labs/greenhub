import { ContainerNotFoundException } from '@/core/plant-context/containers/application/exceptions/container-not-found/container-not-found.exception';
import { ContainerTypeEnum } from '@/core/plant-context/containers/domain/enums/container-type/container-type.enum';
import { ContainerViewModel } from '@/core/plant-context/containers/domain/view-models/container/container.view-model';
import { Test } from '@nestjs/testing';
import { AssertContainerViewModelExistsService } from '../../services/assert-container-view-model-exists/assert-container-view-model-exists.service';
import { ContainerViewModelFindByIdQuery } from './container-view-model-find-by-id.query';
import { ContainerViewModelFindByIdQueryHandler } from './growing-unit-view-model-find-by-id.query-handler';

describe('ContainerViewModelFindByIdQueryHandler', () => {
  let handler: ContainerViewModelFindByIdQueryHandler;
  let mockAssertContainerViewModelExistsService: jest.Mocked<AssertContainerViewModelExistsService>;

  beforeEach(async () => {
    mockAssertContainerViewModelExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertContainerViewModelExistsService>;

    const module = await Test.createTestingModule({
      providers: [
        ContainerViewModelFindByIdQueryHandler,
        {
          provide: AssertContainerViewModelExistsService,
          useValue: mockAssertContainerViewModelExistsService,
        },
      ],
    }).compile();

    handler = module.get<ContainerViewModelFindByIdQueryHandler>(
      ContainerViewModelFindByIdQueryHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return container view model when container exists', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const query = new ContainerViewModelFindByIdQuery({ id: containerId });
      const now = new Date();
      const mockViewModel = new ContainerViewModel({
        id: containerId,
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        plants: [],
        numberOfPlants: 0,
        createdAt: now,
        updatedAt: now,
      });

      mockAssertContainerViewModelExistsService.execute.mockResolvedValue(
        mockViewModel,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockViewModel);
      expect(
        mockAssertContainerViewModelExistsService.execute,
      ).toHaveBeenCalledWith(containerId);
      expect(
        mockAssertContainerViewModelExistsService.execute,
      ).toHaveBeenCalledTimes(1);
    });

    it('should throw ContainerNotFoundException when container does not exist', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const query = new ContainerViewModelFindByIdQuery({ id: containerId });
      const error = new ContainerNotFoundException(containerId);

      mockAssertContainerViewModelExistsService.execute.mockRejectedValue(
        error,
      );

      await expect(handler.execute(query)).rejects.toThrow(error);
      expect(
        mockAssertContainerViewModelExistsService.execute,
      ).toHaveBeenCalledWith(containerId);
    });
  });
});
