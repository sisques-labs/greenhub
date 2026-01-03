import { Injectable, Logger } from '@nestjs/common';

import { TenantViewModel } from '@/generic/tenants/domain/view-models/tenant/tenant.view-model';
import {
	PaginatedTenantResultDto,
	TenantResponseDto,
} from '@/generic/tenants/transport/graphql/dtos/responses/tenant.response.dto';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

@Injectable()
export class TenantGraphQLMapper {
	private readonly logger = new Logger(TenantGraphQLMapper.name);

	/**
	 * Converts an tenant view model to a response DTO.
	 *
	 * @param tenant - The tenant view model to convert
	 * @returns The response DTO
	 */
	toResponseDto(tenant: TenantViewModel): TenantResponseDto {
		this.logger.log(`Mapping tenant view model to response dto: ${tenant.id}`);

		return {
			id: tenant.id,
			clerkId: tenant.clerkId,
			name: tenant.name,
			status: tenant.status,
			createdAt: tenant.createdAt,
			updatedAt: tenant.updatedAt,
		};
	}

	/**
	 * Converts a paginated result to a paginated response DTO.
	 *
	 * @param paginatedResult - The paginated result to convert
	 * @returns The paginated response DTO
	 */
	toPaginatedResponseDto(
		paginatedResult: PaginatedResult<TenantViewModel>,
	): PaginatedTenantResultDto {
		this.logger.log(
			`Mapping paginated tenant result to response dto: ${JSON.stringify(paginatedResult)}`,
		);

		return {
			items: paginatedResult.items.map((tenant) =>
				this.toResponseDto(tenant),
			),
			total: paginatedResult.total,
			page: paginatedResult.page,
			perPage: paginatedResult.perPage,
			totalPages: paginatedResult.totalPages,
		};
	}
}

