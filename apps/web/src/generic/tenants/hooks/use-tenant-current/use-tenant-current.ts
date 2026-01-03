import { useTenantFindById } from '@/generic/tenants/hooks/use-tenant-find-by-id/use-tenant-find-by-id';
import { useSidebarTenantStore } from '@/shared/stores/sidebar-tenant-store';
import { useSidebarUserStore } from '@/shared/stores/sidebar-user-store';
import { useOrganization } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';

/**
 * Hook that provides current tenant functionality
 * Uses Clerk organization to get the tenant ID from the user profile
 * and fetches the tenant data
 */
export function useTenantCurrent(options?: { autoFetch?: boolean }) {
	const { organization } = useOrganization();
	const profile = useSidebarUserStore((state) => state.profile);
	const { setTenant } = useSidebarTenantStore();
	const autoFetch = options?.autoFetch ?? true;

	// Get tenant ID from profile (set by backend during authentication)
	// The backend maps Clerk orgId to internal tenantId
	const tenantId = profile?.tenantId || null;

	// Fetch tenant data if tenantId is available
	const { tenant, isLoading, error, refetch } = useTenantFindById(
		tenantId || '',
		{ enabled: autoFetch && !!tenantId },
	);

	// Keep a ref to the latest fetch function to avoid infinite loops
	const fetchRef = useRef(refetch);
	useEffect(() => {
		fetchRef.current = refetch;
	}, [refetch]);

	// Sync tenant to store when it changes
	useEffect(() => {
		if (tenant) {
			setTenant(tenant);
		}
	}, [tenant, setTenant]);

	// Refetch when tenantId changes
	useEffect(() => {
		if (autoFetch && tenantId) {
			fetchRef.current();
		}
	}, [autoFetch, tenantId]);

	return {
		tenant: tenant || null,
		isLoading,
		error,
		refetch: () => {
			if (tenantId) {
				fetchRef.current();
			}
		},
		organization,
		tenantId,
	};
}
