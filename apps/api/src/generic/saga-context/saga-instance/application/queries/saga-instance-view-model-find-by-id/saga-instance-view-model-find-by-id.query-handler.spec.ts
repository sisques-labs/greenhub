import { Test } from '@nestjs/testing';

import { SagaInstanceNotFoundException } from '@/generic/saga-context/saga-instance/application/exceptions/saga-instance-not-found/saga-instance-not-found.exception';
import { FindSagaInstanceViewModelByIdQuery } from '@/generic/saga-context/saga-instance/application/queries/saga-instance-view-model-find-by-id/saga-instance-view-model-find-by-id.query';
import { FindSagaInstanceViewModelByIdQueryHandler } from '@/generic/saga-context/saga-instance/application/queries/saga-instance-view-model-find-by-id/saga-instance-view-model-find-by-id.query-handler';
import { AssertSagaInstanceViewModelExistsService } from '@/generic/saga-context/saga-instance/application/services/assert-saga-instance-view-model-exists/assert-saga-instance-view-model-exists.service';
import { SagaInstanceStatusEnum } from '@/generic/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { SagaInstanceViewModel } from '@/generic/saga-context/saga-instance/domain/view-models/saga-instance/saga-instance.view-model';

describe('FindSagaInstanceViewModelByIdQueryHandler', () => {
	let handler: FindSagaInstanceViewModelByIdQueryHandler;
	let mockAssertSagaInstanceViewModelExistsService: jest.Mocked<AssertSagaInstanceViewModelExistsService>;

	beforeEach(async () => {
		mockAssertSagaInstanceViewModelExistsService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<AssertSagaInstanceViewModelExistsService>;

		const module = await Test.createTestingModule({
			providers: [
				FindSagaInstanceViewModelByIdQueryHandler,
				{
					provide: AssertSagaInstanceViewModelExistsService,
					useValue: mockAssertSagaInstanceViewModelExistsService,
				},
			],
		}).compile();

		handler = module.get<FindSagaInstanceViewModelByIdQueryHandler>(
			FindSagaInstanceViewModelByIdQueryHandler,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('execute', () => {
		it('should return saga instance view model when saga instance exists', async () => {
			const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
			const queryDto = { id: sagaInstanceId };
			const query = new FindSagaInstanceViewModelByIdQuery(queryDto);

			const mockViewModel = new SagaInstanceViewModel({
				id: sagaInstanceId,
				name: 'Order Processing Saga',
				status: SagaInstanceStatusEnum.PENDING,
				startDate: null,
				endDate: null,
				createdAt: new Date('2024-01-01T10:00:00Z'),
				updatedAt: new Date('2024-01-01T10:00:00Z'),
			});

			mockAssertSagaInstanceViewModelExistsService.execute.mockResolvedValue(
				mockViewModel,
			);

			const result = await handler.execute(query);

			expect(result).toBe(mockViewModel);
			expect(
				mockAssertSagaInstanceViewModelExistsService.execute,
			).toHaveBeenCalledWith(sagaInstanceId);
			expect(
				mockAssertSagaInstanceViewModelExistsService.execute,
			).toHaveBeenCalledTimes(1);
		});

		it('should throw SagaInstanceNotFoundException when saga instance does not exist', async () => {
			const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
			const queryDto = { id: sagaInstanceId };
			const query = new FindSagaInstanceViewModelByIdQuery(queryDto);

			const error = new SagaInstanceNotFoundException(sagaInstanceId);
			mockAssertSagaInstanceViewModelExistsService.execute.mockRejectedValue(
				error,
			);

			await expect(handler.execute(query)).rejects.toThrow(
				SagaInstanceNotFoundException,
			);
			expect(
				mockAssertSagaInstanceViewModelExistsService.execute,
			).toHaveBeenCalledWith(sagaInstanceId);
		});

		it('should return view model with all fields populated', async () => {
			const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
			const queryDto = { id: sagaInstanceId };
			const query = new FindSagaInstanceViewModelByIdQuery(queryDto);

			const startDate = new Date('2024-01-01T10:00:00Z');
			const endDate = new Date('2024-01-01T11:00:00Z');
			const mockViewModel = new SagaInstanceViewModel({
				id: sagaInstanceId,
				name: 'Order Processing Saga',
				status: SagaInstanceStatusEnum.COMPLETED,
				startDate: startDate,
				endDate: endDate,
				createdAt: new Date('2024-01-01T10:00:00Z'),
				updatedAt: new Date('2024-01-01T11:00:00Z'),
			});

			mockAssertSagaInstanceViewModelExistsService.execute.mockResolvedValue(
				mockViewModel,
			);

			const result = await handler.execute(query);

			expect(result.id).toBe(sagaInstanceId);
			expect(result.name).toBe('Order Processing Saga');
			expect(result.status).toBe(SagaInstanceStatusEnum.COMPLETED);
			expect(result.startDate).toEqual(startDate);
			expect(result.endDate).toEqual(endDate);
		});
	});
});
