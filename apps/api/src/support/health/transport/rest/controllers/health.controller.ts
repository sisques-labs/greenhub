import { Controller, Get, Logger } from '@nestjs/common';
import { HealthCheckService } from '@/support/health/application/services/health-check/health-check.service';
import { HealthRestMapper } from '@/support/health/transport/rest/mappers/health-rest.mapper';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly healthRestMapper: HealthRestMapper,
  ) {}

  @Get()
  async healthCheck() {
    this.logger.log('Checking health');
    const result = await this.healthCheckService.execute();
    return this.healthRestMapper.toResponseDto(result);
  }
}
