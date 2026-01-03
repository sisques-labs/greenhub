import { GraphQLClient } from "../../shared/client/graphql-client.js";
import type { MutationResponse } from "../../shared/types/index.js";
import {
	TENANT_FIND_BY_CRITERIA_QUERY,
	TENANT_FIND_BY_ID_QUERY,
} from "../graphql/queries/tenants.queries.js";
import type {
	PaginatedTenantResult,
	TenantFindByCriteriaInput,
	TenantFindByIdInput,
	TenantResponse,
} from "../index.js";

export class TenantClient {
	constructor(private client: GraphQLClient) {}

	async findByCriteria(
		input?: TenantFindByCriteriaInput,
	): Promise<PaginatedTenantResult> {
		const result = await this.client.request<{
			tenantsFindByCriteria: PaginatedTenantResult;
		}>({
			query: TENANT_FIND_BY_CRITERIA_QUERY,
			variables: { input: input || {} },
		});

		return result.tenantsFindByCriteria;
	}

	async findById(input: TenantFindByIdInput): Promise<TenantResponse> {
		const result = await this.client.request<{ tenantFindById: TenantResponse }>({
			query: TENANT_FIND_BY_ID_QUERY,
			variables: { input },
		});

		return result.tenantFindById;
	}
}

