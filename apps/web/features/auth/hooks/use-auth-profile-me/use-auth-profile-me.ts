'use client';

import type { AuthUserProfileResponse } from '@/features/auth/api/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSidebarUserStore } from 'shared/stores/sidebar-user-store';
import { authApiClient } from '../../api/auth-api.client';
import { transformUserProfile } from '../../api/types';

/**
 * Hook for fetching authenticated user profile using TanStack Query
 * Synchronizes profile with sidebar user store
 */
export function useAuthProfileMe(options?: { enabled?: boolean }) {
	const enabled = options?.enabled ?? true;
	const setProfile = useSidebarUserStore((state) => state.setProfile);

	const query = useQuery({
		queryKey: ['auth', 'profile'],
		queryFn: async () => {
			const apiResponse = await authApiClient.me();
			// Transform API response (string dates) to UserProfile (Date objects)
			return transformUserProfile(apiResponse);
		},
		// Only enable query on client-side (not during SSR)
		enabled: enabled && typeof window !== 'undefined',
		staleTime: 5 * 60 * 1000, // 5 minutes - profile doesn't change often
		retry: 1,
	});

	// Sync profile to store when data changes
	useEffect(() => {
		if (query.data) {
			// UserProfile is compatible with AuthUserProfileResponse
			setProfile(query.data as AuthUserProfileResponse);
		}
	}, [query.data, setProfile]);

	return {
		profile: query.data || null,
		isLoading: query.isLoading,
		error: query.error,
		refetch: query.refetch,
	};
}
