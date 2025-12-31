import { QueryBus } from '@nestjs/cqrs';
import { FindAuthsByCriteriaQuery } from '@/generic/auth/application/queries/find-auths-by-criteria/find-auths-by-criteria.query';
import { AuthProviderEnum } from '@/generic/auth/domain/enums/auth-provider.enum';
import { AuthViewModel } from '@/generic/auth/domain/view-models/auth.view-model';
import { AuthFindByCriteriaRequestDto } from '@/generic/auth/transport/graphql/dtos/requests/auth-find-by-criteria.request.dto';
import { PaginatedAuthResultDto } from '@/generic/auth/transport/graphql/dtos/responses/auth.response.dto';
import { AuthGraphQLMapper } from '@/generic/auth/transport/graphql/mappers/auth/auth.mapper';
import { AuthUserProfileGraphQLMapper } from '@/generic/auth/transport/graphql/mappers/auth-user-profile/auth-user-profile.mapper';
import { AuthQueryResolver } from '@/generic/auth/transport/graphql/resolvers/auth-queries/auth-queries.resolver';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { FilterOperator } from '@/shared/domain/enums/filter-operator.enum';
import { SortDirection } from '@/shared/domain/enums/sort-direction.enum';

describe('AuthQueryResolver', () => {
	let resolver: AuthQueryResolver;
	let mockQueryBus: jest.Mocked<QueryBus>;
	let mockAuthGraphQLMapper: jest.Mocked<AuthGraphQLMapper>;
	let mockAuthUserProfileGraphQLMapper: jest.Mocked<AuthUserProfileGraphQLMapper>;

	beforeEach(() => {
		mockQueryBus = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<QueryBus>;

		mockAuthGraphQLMapper = {
			toResponseDto: jest.fn(),
			toPaginatedResponseDto: jest.fn(),
		} as unknown as jest.Mocked<AuthGraphQLMapper>;

		mockAuthUserProfileGraphQLMapper = {
			toResponseDto: jest.fn(),
		} as unknown as jest.Mocked<AuthUserProfileGraphQLMapper>;

		resolver = new AuthQueryResolver(
			mockQueryBus,
			mockAuthGraphQLMapper,
			mockAuthUserProfileGraphQLMapper,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('findAuthsByCriteria', () => {
		it('should return paginated auths when criteria matches', async () => {
			const input: AuthFindByCriteriaRequestDto = {
				filters: [],
				sorts: [],
				pagination: { page: 1, perPage: 10 },
			};

			const now = new Date();
			const viewModels: AuthViewModel[] = [
				new AuthViewModel({
					id: '123e4567-e89b-12d3-a456-426614174000',
					userId: '123e4567-e89b-12d3-a456-426614174001',
					email: 'test1@example.com',
					emailVerified: true,
					lastLoginAt: now,
					password: '$2b$12$hashedpassword',
					phoneNumber: null,
					provider: AuthProviderEnum.LOCAL,
					providerId: null,
					twoFactorEnabled: false,
					createdAt: now,
					updatedAt: now,
				}),
				new AuthViewModel({
					id: '223e4567-e89b-12d3-a456-426614174002',
					userId: '323e4567-e89b-12d3-a456-426614174003',
					email: 'test2@example.com',
					emailVerified: false,
					lastLoginAt: null,
					password: null,
					phoneNumber: null,
					provider: AuthProviderEnum.GOOGLE,
					providerId: 'google-123',
					twoFactorEnabled: true,
					createdAt: now,
					updatedAt: now,
				}),
			];

			const paginatedResult = new PaginatedResult<AuthViewModel>(
				viewModels,
				2,
				1,
				10,
			);

			const paginatedResponseDto: PaginatedAuthResultDto = {
				items: [
					{
						id: '123e4567-e89b-12d3-a456-426614174000',
						userId: '123e4567-e89b-12d3-a456-426614174001',
						email: 'test1@example.com',
						emailVerified: true,
						lastLoginAt: now,
						provider: AuthProviderEnum.LOCAL,
						providerId: null,
						twoFactorEnabled: false,
					},
					{
						id: '223e4567-e89b-12d3-a456-426614174002',
						userId: '323e4567-e89b-12d3-a456-426614174003',
						email: 'test2@example.com',
						emailVerified: false,
						lastLoginAt: null,
						provider: AuthProviderEnum.GOOGLE,
						providerId: 'google-123',
						twoFactorEnabled: true,
					},
				],
				total: 2,
				page: 1,
				perPage: 10,
				totalPages: 1,
			};

			mockQueryBus.execute.mockResolvedValue(paginatedResult);
			mockAuthGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
				paginatedResponseDto,
			);

			const result = await resolver.findAuthsByCriteria(input);

			expect(result).toBe(paginatedResponseDto);
			expect(mockQueryBus.execute).toHaveBeenCalledWith(
				expect.any(FindAuthsByCriteriaQuery),
			);
			const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
			expect(query).toBeInstanceOf(FindAuthsByCriteriaQuery);
			expect(query.criteria).toBeInstanceOf(Criteria);
			expect(mockAuthGraphQLMapper.toPaginatedResponseDto).toHaveBeenCalledWith(
				paginatedResult,
			);
		});

		it('should handle empty criteria input', async () => {
			const input: AuthFindByCriteriaRequestDto = undefined;

			const paginatedResult = new PaginatedResult<AuthViewModel>([], 0, 1, 10);

			const paginatedResponseDto: PaginatedAuthResultDto = {
				items: [],
				total: 0,
				page: 1,
				perPage: 10,
				totalPages: 0,
			};

			mockQueryBus.execute.mockResolvedValue(paginatedResult);
			mockAuthGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
				paginatedResponseDto,
			);

			const result = await resolver.findAuthsByCriteria(input);

			expect(result).toBe(paginatedResponseDto);
			expect(mockQueryBus.execute).toHaveBeenCalledWith(
				expect.any(FindAuthsByCriteriaQuery),
			);
			const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
			expect(query.criteria).toBeInstanceOf(Criteria);
		});

		it('should handle criteria with filters and sorts', async () => {
			const input: AuthFindByCriteriaRequestDto = {
				filters: [
					{
						field: 'email',
						operator: FilterOperator.LIKE,
						value: 'test',
					},
				],
				sorts: [
					{
						field: 'createdAt',
						direction: SortDirection.DESC,
					},
				],
				pagination: { page: 2, perPage: 5 },
			};

			const paginatedResult = new PaginatedResult<AuthViewModel>([], 0, 2, 5);

			const paginatedResponseDto: PaginatedAuthResultDto = {
				items: [],
				total: 0,
				page: 2,
				perPage: 5,
				totalPages: 0,
			};

			mockQueryBus.execute.mockResolvedValue(paginatedResult);
			mockAuthGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
				paginatedResponseDto,
			);

			const result = await resolver.findAuthsByCriteria(input);

			expect(result).toBe(paginatedResponseDto);
			expect(mockQueryBus.execute).toHaveBeenCalledTimes(1);
			const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
			expect(query.criteria.filters).toHaveLength(1);
			expect(query.criteria.sorts).toHaveLength(1);
		});
	});
});
