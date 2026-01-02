"use client";

import { useAuth } from "@clerk/nextjs";
import { SDK } from "@repo/sdk";
import { SDKProvider } from "@repo/sdk/react";
import { useMemo } from "react";

interface SDKProviderWithClerkProps {
	apiUrl: string;
	children: React.ReactNode;
}

/**
 * Provider that integrates Clerk authentication with the SDK
 * Gets the Clerk session token and passes it to the SDK via getToken function
 */
export function SDKProviderWithClerk({
	apiUrl,
	children,
}: SDKProviderWithClerkProps) {
	const { getToken } = useAuth();

	const sdk = useMemo(() => {
		return new SDK({
			apiUrl,
			getToken: getToken
				? async () => {
						try {
							const token = await getToken();
							return token || null;
						} catch (error) {
							console.error("Failed to get Clerk token:", error);
							return null;
						}
					}
				: undefined,
		});
	}, [apiUrl, getToken]);

	return <SDKProvider sdk={sdk}>{children}</SDKProvider>;
}

