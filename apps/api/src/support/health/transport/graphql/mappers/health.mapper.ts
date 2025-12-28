import { Injectable } from '@nestjs/common';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { HealthViewModel } from '@/support/health/domain/view-models/health.view-model';
import {
  HealthResponseDto,
  PaginatedHealthResultDto,
} from '@/support/health/transport/graphql/dtos/responses/health.response.dto';

@Injectable()
export class HealthGraphQLMapper {
  toResponseDto(health: HealthViewModel): HealthResponseDto {
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
