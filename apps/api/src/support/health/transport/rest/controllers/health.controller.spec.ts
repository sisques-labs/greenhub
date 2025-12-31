import { HealthCheckService } from '@/support/health/application/services/health-check/health-check.service';
import { HealthViewModel } from '@/support/health/domain/view-models/health.view-model';
import { HealthController } from '@/support/health/transport/rest/controllers/health.controller';
import { HealthRestMapper } from '@/support/health/transport/rest/mappers/health-rest.mapper';

describe('HealthController', () => {
	let controller: HealthController;
	let mockHealthCheckService: jest.Mocked<HealthCheckService>;
	let mockHealthRestMapper: jest.Mocked<HealthRestMapper>;

	beforeEach(() => {
		mockHealthCheckService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<HealthCheckService>;

		mockHealthRestMapper = {
			toResponseDto: jest.fn(),
			toPaginatedResponseDto: jest.fn(),
		} as unknown as jest.Mocked<HealthRestMapper>;

		controller = new HealthController(
			mockHealthCheckService,
			mockHealthRestMapper,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should return mapped health response', async () => {
		const viewModel = new HealthViewModel({
			status: 'OK',
			writeDatabaseStatus: 'OK',
			readDatabaseStatus: 'OK',
		});
		const responseDto = {
			status: 'OK',
			writeDatabaseStatus: 'OK',
			readDatabaseStatus: 'OK',
		};

		mockHealthCheckService.execute.mockResolvedValue(viewModel);
		mockHealthRestMapper.toResponseDto.mockReturnValue(responseDto);

		const result = await controller.healthCheck();

		expect(mockHealthCheckService.execute).toHaveBeenCalledTimes(1);
		expect(mockHealthRestMapper.toResponseDto).toHaveBeenCalledWith(viewModel);
		expect(result).toBe(responseDto);
	});
});
