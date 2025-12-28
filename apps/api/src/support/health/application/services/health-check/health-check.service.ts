import { Injectable, Logger } from '@nestjs/common';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { HealthCheckQuery } from '@/support/health/application/queries/health-check/health-check.query';
import { HealthReadDatabaseCheckService } from '@/support/health/application/services/health-read-database-check/health-read-database-check.service';
import { HealthWriteDatabaseCheckService } from '@/support/health/application/services/health-write-database-check/health-write-database-check.service';
import { HealthStatusEnum } from '@/support/health/domain/enum/health-status.enum';
import { HealthViewModelFactory } from '@/support/health/domain/factories/health-view-model.factory';
import { HealthViewModel } from '@/support/health/domain/view-models/health.view-model';

@Injectable()
export class HealthCheckService
  implements IBaseService<HealthCheckQuery, HealthViewModel>
{
  private readonly logger = new Logger(HealthCheckService.name);

  constructor(
    private readonly healthViewModelFactory: HealthViewModelFactory,
    private readonly healthWriteDatabaseCheckService: HealthWriteDatabaseCheckService,
    private readonly healthReadDatabaseCheckService: HealthReadDatabaseCheckService,
  ) {}

  /**
   * Executes the health check operation.
   *
   * Logs the health check process and returns a HealthViewModel
   * indicating the current status of the application.
   *
   * @returns {Promise<HealthViewModel>} The view model representing the health status.
   */
  async execute(): Promise<HealthViewModel> {
    this.logger.log('Checking health');

    // 01: Check write database connection
    const writeDatabaseStatus =
      await this.healthWriteDatabaseCheckService.execute();

    // 02: Check read database connection
    const readDatabaseStatus =
      await this.healthReadDatabaseCheckService.execute();

    // 03: Determine overall status based on database checks
    const overallStatus =
      writeDatabaseStatus === HealthStatusEnum.OK &&
      readDatabaseStatus === HealthStatusEnum.OK
        ? HealthStatusEnum.OK
        : HealthStatusEnum.ERROR;

    return this.healthViewModelFactory.create({
      status: overallStatus,
      writeDatabaseStatus,
      readDatabaseStatus,
    });
  }
}
