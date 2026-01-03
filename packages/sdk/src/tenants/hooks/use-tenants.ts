"use client";
import { useAsyncState } from "../../react/hooks/use-async-state.js";
import { useSDKContext } from "../../react/index.js";
import type {
	PaginatedTenantResult,
	TenantFindByCriteriaInput,
	TenantFindByIdInput,
	TenantResponse,
} from "../index.js";

/**
 * Hook for tenant operations
 */
export function useTenants() {
	const sdk = useSDKContext();
	const findByCriteria = useAsyncState<
		PaginatedTenantResult,
		[TenantFindByCriteriaInput?]
	>((input?: TenantFindByCriteriaInput) => sdk.tenants.findByCriteria(input));

	const findById = useAsyncState<TenantResponse, [TenantFindByIdInput]>(
		(input: TenantFindByIdInput) => sdk.tenants.findById(input),
	);

	return {
		findByCriteria: {
			...findByCriteria,
			fetch: findByCriteria.execute,
		},
		findById: {
			...findById,
			fetch: findById.execute,
		},
	};
}

