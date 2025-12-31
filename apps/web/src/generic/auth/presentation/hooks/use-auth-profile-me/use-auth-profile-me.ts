import { useAuth } from "@repo/sdk";
import { useEffect, useRef } from "react";
import { useSidebarUserStore } from "@/shared/stores/sidebar-user-store";

/**
 * Hook that provides authenticated user profile functionality
 * Uses SDK directly since backend handles all validation
 * Synchronizes profile with sidebar user store
 */
export function useAuthProfileMe(options?: { autoFetch?: boolean }) {
	const { profileMe } = useAuth();
	const autoFetch = options?.autoFetch ?? true;
	const { setProfile } = useSidebarUserStore();

	// Keep a ref to the latest fetch function to avoid infinite loops
	const fetchRef = useRef(profileMe.fetch);
	useEffect(() => {
		fetchRef.current = profileMe.fetch;
	}, [profileMe.fetch]);

	// Sync profile to store when it changes
	useEffect(() => {
		if (profileMe.data) {
			setProfile(profileMe.data);
		}
	}, [profileMe.data, setProfile]);

	// Only fetch when autoFetch changes, using ref to avoid dependency on fetch function
	useEffect(() => {
		if (autoFetch) {
			fetchRef.current();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [autoFetch]);

	return {
		profile: profileMe.data || null,
		isLoading: profileMe.loading,
		error: profileMe.error,
		refetch: () => {
			profileMe.fetch();
		},
	};
}
