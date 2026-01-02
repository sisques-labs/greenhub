"use client";
import { useAsyncState } from "../../react/hooks/use-async-state.js";
import { useSDKContext } from "../../react/sdk-context.js";
import type { OverviewResponse } from "../types/overview-response.type.js";

export function useOverview() {
	const sdk = useSDKContext();
	const find = useAsyncState<OverviewResponse | null, []>(() =>
		sdk.overview.find(),
	);

	return {
		find: {
			...find,
			fetch: find.execute,
		},
	};
}



