import { AuthUpdatedEventHandler } from '@/generic/auth/application/event-handlers/auth-updated/auth-updated.event-handler';
import { AssertAuthViewModelExistsService } from '@/generic/auth/application/services/assert-auth-view-model-exists/assert-auth-view-model-exists.service';
import { AuthProviderEnum } from '@/generic/auth/domain/enums/auth-provider.enum';
import { AuthReadRepository } from '@/generic/auth/domain/repositories/auth-read.repository';
import { AuthViewModel } from '@/generic/auth/domain/view-models/auth.view-model';
import { AuthUpdatedEvent } from '@/shared/domain/events/auth/auth-updated/auth-updated.event';

describe('AuthUpdatedEventHandler', () => {
  let handler: AuthUpdatedEventHandler;
  let mockAuthReadRepository: jest.Mocked<AuthReadRepository>;
  let mockAssertAuthViewModelExistsService: jest.Mocked<AssertAuthViewModelExistsService>;

  beforeEach(() => {
    mockAuthReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<AuthReadRepository>;

    mockAssertAuthViewModelExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertAuthViewModelExistsService>;

    handler = new AuthUpdatedEventHandler(
      mockAuthReadRepository,
      mockAssertAuthViewModelExistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should update and save auth view model when event is handled', async () => {
      const authId = '123e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        id: authId,
        userId: '123e4567-e89b-12d3-a456-426614174001',
        email: 'updated@example.com',
        emailVerified: true,
        lastLoginAt: null,
        password: null,
        phoneNumber: null,
        provider: AuthProviderEnum.LOCAL,
        providerId: null,
        twoFactorEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const event = new AuthUpdatedEvent(
        {
          aggregateId: authId,
          aggregateType: 'AuthAggregate',
          eventType: 'AuthUpdatedEvent',
        },
        eventData,
      );

      const mockViewModel = new AuthViewModel({
        id: authId,
        userId: eventData.userId,
        email: 'old@example.com',
        emailVerified: false,
        lastLoginAt: null,
        password: null,
        phoneNumber: null,
        provider: AuthProviderEnum.LOCAL,
        providerId: null,
        twoFactorEnabled: false,
        createdAt: eventData.createdAt,
        updatedAt: eventData.updatedAt,
      });

      const updateSpy = jest.spyOn(mockViewModel, 'update');

      mockAssertAuthViewModelExistsService.execute.mockResolvedValue(
        mockViewModel,
      );
      mockAuthReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockAssertAuthViewModelExistsService.execute).toHaveBeenCalledWith(
        authId,
      );
      expect(updateSpy).toHaveBeenCalledWith(eventData);
      expect(mockAuthReadRepository.save).toHaveBeenCalledWith(mockViewModel);
      expect(mockAuthReadRepository.save).toHaveBeenCalledTimes(1);

      updateSpy.mockRestore();
    });
  });
});
