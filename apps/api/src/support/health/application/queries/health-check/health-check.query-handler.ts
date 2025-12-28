import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { HealthCheckQuery } from '@/support/health/application/queries/health-check/health-check.query';
import { HealthCheckService } from '@/support/health/application/services/health-check/health-check.service';
import { HealthViewModel } from '@/support/health/domain/view-models/health.view-model';

@QueryHandler(HealthCheckQuery)
export class HealthCheckQueryHandler
  implements IQueryHandler<HealthCheckQuery>
{
  private readonly logger = new Logger(HealthCheckQueryHandler.name);

  constructor(private readonly healthCheckService: HealthCheckService) {}

  async execute(): Promise<HealthViewModel> {
    this.logger.log('Executing health check query');
    return await this.healthCheckService.execute();
  }
}
