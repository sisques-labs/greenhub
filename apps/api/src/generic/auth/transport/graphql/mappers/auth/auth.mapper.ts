import { Injectable } from '@nestjs/common';

import { AuthViewModel } from '@/generic/auth/domain/view-models/auth.view-model';
import {
	AuthResponseDto,
	PaginatedAuthResultDto,
} from '@/generic/auth/transport/graphql/dtos/responses/auth.response.dto';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

@Injectable()
export class AuthGraphQLMapper {
	toResponseDto(auth: AuthViewModel): AuthResponseDto {
		return {
			id: auth.id,
			userId: auth.userId,
			email: auth.email,
			emailVerified: auth.emailVerified,
			lastLoginAt: auth.lastLoginAt,
			provider: auth.provider,
			providerId: auth.providerId,
			twoFactorEnabled: auth.twoFactorEnabled,
			createdAt: auth.createdAt,
			updatedAt: auth.updatedAt,
		};
	}

	toPaginatedResponseDto(
		paginatedResult: PaginatedResult<AuthViewModel>,
	): PaginatedAuthResultDto {
		return {
			items: paginatedResult.items.map((auth) => this.toResponseDto(auth)),
			total: paginatedResult.total,
			page: paginatedResult.page,
			perPage: paginatedResult.perPage,
			totalPages: paginatedResult.totalPages,
		};
	}
}
