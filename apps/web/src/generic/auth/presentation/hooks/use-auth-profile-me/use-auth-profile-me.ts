import { useAuth } from '@repo/sdk';
import { useEffect } from 'react';
import { useSidebarUserStore } from '@/shared/stores/sidebar-user-store';

/**
 * Hook that provides authenticated user profile functionality
 * Uses SDK directly since backend handles all validation
 * Synchronizes profile with sidebar user store
 */
export function useAuthProfileMe(options?: { autoFetch?: boolean }) {
	const { profileMe } = useAuth();
	const autoFetch = options?.autoFetch ?? true;
	const { setProfile } = useSidebarUserStore();

	// Sync profile to store when it changes
	useEffect(() => {
		if (profileMe.data) {
			setProfile(profileMe.data);
		}
	}, [profileMe.data, setProfile]);

	useEffect(() => {
		if (autoFetch) {
			profileMe.fetch();
		}
	}, [autoFetch, profileMe.fetch]);

	return {
		profile: profileMe.data || null,
		isLoading: profileMe.loading,
		error: profileMe.error,
		refetch: () => {
			profileMe.fetch();
		},
	};
}
