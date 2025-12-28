import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { HealthViewModel } from '@/support/health/domain/view-models/health.view-model';
import { PaginatedHealthResultDto } from '@/support/health/transport/graphql/dtos/responses/health.response.dto';
import { HealthRestResponseDto } from '@/support/health/transport/rest/dtos/responses/health.response.dto';

export class HealthRestMapper {
  toResponseDto(health: HealthViewModel): HealthRestResponseDto {
    return {
      status: health.status,
      writeDatabaseStatus: health.writeDatabaseStatus,
      readDatabaseStatus: health.readDatabaseStatus,
    };
  }

  toPaginatedResponseDto(
    paginatedResult: PaginatedResult<HealthViewModel>,
  ): PaginatedHealthResultDto {
    return {
      items: paginatedResult.items.map((health) => this.toResponseDto(health)),
      total: paginatedResult.total,
      page: paginatedResult.page,
      perPage: paginatedResult.perPage,
      totalPages: paginatedResult.totalPages,
    };
  }
}
