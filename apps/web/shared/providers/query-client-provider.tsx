'use client';

import {
	QueryClient,
	QueryClientProvider as TanStackQueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { type ReactNode, useState } from 'react';

interface QueryClientProviderProps {
	children: ReactNode;
}

/**
 * Provides TanStack Query client to the app. Defined in the web app so the provider
 * and hooks share the same bundle and React context (avoids "No QueryClient set").
 */
export function QueryClientProvider({ children }: QueryClientProviderProps) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000,
						refetchOnWindowFocus: false,
						retry: 1,
					},
					mutations: {
						retry: 1,
					},
				},
			}),
	);

	return (
		<TanStackQueryClientProvider client={queryClient}>
			{children}
			{process.env.NODE_ENV === 'development' && (
				<ReactQueryDevtools initialIsOpen={false} />
			)}
		</TanStackQueryClientProvider>
	);
}
