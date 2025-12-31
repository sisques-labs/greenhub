import { Injectable, Logger } from "@nestjs/common";
import { UserViewModel } from "@/generic/users/domain/view-models/user.view-model";
import {
	PaginatedUserResultDto,
	UserResponseDto,
} from "@/generic/users/transport/graphql/dtos/responses/user.response.dto";
import { PaginatedResult } from "@/shared/domain/entities/paginated-result.entity";

@Injectable()
export class UserGraphQLMapper {
	private readonly logger = new Logger(UserGraphQLMapper.name);

	toResponseDto(user: UserViewModel): UserResponseDto {
		this.logger.log(`Mapping user view model to response dto: ${user.id}`);

		return {
			id: user.id,
			name: user.name,
			bio: user.bio,
			avatarUrl: user.avatarUrl,
			lastName: user.lastName,
			role: user.role,
			status: user.status,
			userName: user.userName,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
	}

	toPaginatedResponseDto(
		paginatedResult: PaginatedResult<UserViewModel>,
	): PaginatedUserResultDto {
		this.logger.log(
			`Mapping paginated user result to response dto: ${JSON.stringify(paginatedResult)}`,
		);
		return {
			items: paginatedResult.items.map((user) => this.toResponseDto(user)),
			total: paginatedResult.total,
			page: paginatedResult.page,
			perPage: paginatedResult.perPage,
			totalPages: paginatedResult.totalPages,
		};
	}
}
