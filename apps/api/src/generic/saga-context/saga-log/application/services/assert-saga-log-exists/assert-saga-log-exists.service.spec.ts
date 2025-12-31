import { Test } from '@nestjs/testing';
import { SagaLogNotFoundException } from '@/generic/saga-context/saga-log/application/exceptions/saga-log-not-found/saga-log-not-found.exception';
import { AssertSagaLogExistsService } from '@/generic/saga-context/saga-log/application/services/assert-saga-log-exists/assert-saga-log-exists.service';
import { SagaLogAggregate } from '@/generic/saga-context/saga-log/domain/aggregates/saga-log.aggregate';
import { SagaLogTypeEnum } from '@/generic/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import {
	SAGA_LOG_WRITE_REPOSITORY_TOKEN,
	SagaLogWriteRepository,
} from '@/generic/saga-context/saga-log/domain/repositories/saga-log-write.repository';
import { SagaLogMessageValueObject } from '@/generic/saga-context/saga-log/domain/value-objects/saga-log-message/saga-log-message.vo';
import { SagaLogTypeValueObject } from '@/generic/saga-context/saga-log/domain/value-objects/saga-log-type/saga-log-type.vo';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaLogUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-log-uuid/saga-log-uuid.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';

describe('AssertSagaLogExistsService', () => {
	let service: AssertSagaLogExistsService;
	let mockSagaLogWriteRepository: jest.Mocked<SagaLogWriteRepository>;

	beforeEach(async () => {
		mockSagaLogWriteRepository = {
			findById: jest.fn(),
			findBySagaInstanceId: jest.fn(),
			findBySagaStepId: jest.fn(),
			save: jest.fn(),
			delete: jest.fn(),
		} as unknown as jest.Mocked<SagaLogWriteRepository>;

		const module = await Test.createTestingModule({
			providers: [
				AssertSagaLogExistsService,
				{
					provide: SAGA_LOG_WRITE_REPOSITORY_TOKEN,
					useValue: mockSagaLogWriteRepository,
				},
			],
		}).compile();

		service = module.get<AssertSagaLogExistsService>(
			AssertSagaLogExistsService,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	const createSagaLogAggregate = (): SagaLogAggregate => {
		const now = new Date();
		return new SagaLogAggregate(
			{
				id: new SagaLogUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
				sagaInstanceId: new SagaInstanceUuidValueObject(
					'223e4567-e89b-12d3-a456-426614174000',
				),
				sagaStepId: new SagaStepUuidValueObject(
					'323e4567-e89b-12d3-a456-426614174000',
				),
				type: new SagaLogTypeValueObject(SagaLogTypeEnum.INFO),
				message: new SagaLogMessageValueObject('Test log message'),
				createdAt: new DateValueObject(now),
				updatedAt: new DateValueObject(now),
			},
			false,
		);
	};

	describe('execute', () => {
		it('should return saga log when it exists', async () => {
			const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';
			const existingSagaLog = createSagaLogAggregate();

			mockSagaLogWriteRepository.findById.mockResolvedValue(existingSagaLog);

			const result = await service.execute(sagaLogId);

			expect(result).toBe(existingSagaLog);
			expect(mockSagaLogWriteRepository.findById).toHaveBeenCalledWith(
				sagaLogId,
			);
			expect(mockSagaLogWriteRepository.findById).toHaveBeenCalledTimes(1);
		});

		it('should throw SagaLogNotFoundException when saga log does not exist', async () => {
			const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';

			mockSagaLogWriteRepository.findById.mockResolvedValue(null);

			await expect(service.execute(sagaLogId)).rejects.toThrow(
				SagaLogNotFoundException,
			);
			expect(mockSagaLogWriteRepository.findById).toHaveBeenCalledWith(
				sagaLogId,
			);
		});

		it('should throw SagaLogNotFoundException with correct message', async () => {
			const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';

			mockSagaLogWriteRepository.findById.mockResolvedValue(null);

			try {
				await service.execute(sagaLogId);
				fail('Should have thrown SagaLogNotFoundException');
			} catch (error) {
				expect(error).toBeInstanceOf(SagaLogNotFoundException);
				expect(error.message).toContain(sagaLogId);
			}
		});
	});
});
