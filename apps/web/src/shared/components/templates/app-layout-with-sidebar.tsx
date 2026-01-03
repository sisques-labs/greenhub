"use client";

import PageWithSidebarTemplate from "@repo/shared/presentation/components/templates/page-with-sidebar-template";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useAuthLogout } from "@/generic/auth/presentation/hooks/use-auth-logout/use-auth-logout";
import { useAuthProfileMe } from "@/generic/auth/presentation/hooks/use-auth-profile-me/use-auth-profile-me";
import { useOrganization } from "@clerk/nextjs";
import { TenantSelector } from "@/generic/tenants/components/organisms/tenant-selector/tenant-selector";
import { useTenantCurrent } from "@/generic/tenants/hooks/use-tenant-current/use-tenant-current";
import { useAppRoutes } from "@/shared/hooks/use-routes";
import { useSidebarTenantStore } from "@/shared/stores/sidebar-tenant-store";
import { useSidebarUserStore } from "@/shared/stores/sidebar-user-store";

interface AppLayoutWithSidebarProps {
	children: React.ReactNode;
}

/**
 * Layout component that wraps pages with sidebar, excluding auth routes
 */
export function AppLayoutWithSidebar({ children }: AppLayoutWithSidebarProps) {
	const pathname = usePathname();
	const { getSidebarData, routes } = useAppRoutes();
	const t = useTranslations("nav");

	// Check if current route is auth (should not show sidebar)
	const isAuthRoute = useMemo(() => {
		return pathname?.includes("/auth") ?? false;
	}, [pathname]);

	// Get sidebar navigation data
	const sidebarNavData = getSidebarData();

	// Initialize profile loading (this will sync to store)
	useAuthProfileMe();

	// Initialize tenant loading (this will sync to store)
	const { organization } = useOrganization();
	useTenantCurrent();

	// Get user profile from store (for sidebar)
	const profile = useSidebarUserStore((state) => state.profile);

	// Get tenant from store (for sidebar header)
	const tenant = useSidebarTenantStore((state) => state.tenant);

	// Get logout handler
	const { handleLogout } = useAuthLogout();

		// Prepare sidebar data with header and footer
	const sidebarData = useMemo(() => {
		// Get tenant name from tenant store (from backend) or from Clerk organization as fallback
		const tenantName =
			tenant?.name ||
			organization?.name ||
			process.env.NEXT_PUBLIC_APP_NAME ||
			"App Name";

		return {
			...sidebarNavData,
			header: {
				// Show tenant name from backend or Clerk organization
				appName: tenantName,
				// Show "Dashboard" as subtitle when tenant or organization is available
				subtitle: tenant || organization ? "Dashboard" : undefined,
				logoSrc: "/favicon.ico",
				url: routes.home,
				// Add tenant selector action button
				action: <TenantSelector />,
			},
			footer: {
				avatarSrc: profile?.avatarUrl || undefined,
				avatarFallback:
					profile?.name?.charAt(0) || profile?.userName?.charAt(0) || "U",
				name: profile?.name || profile?.userName || "User",
				profileUrl: routes.userProfile,
			},
		};
	}, [sidebarNavData, profile, tenant, organization, routes]);

	// Handle logout with user ID
	const onLogout = useMemo(() => {
		if (!profile?.userId) return undefined;
		return () => handleLogout(profile.userId);
	}, [profile, handleLogout]);

	// If auth route, render children without sidebar
	if (isAuthRoute) {
		return <>{children}</>;
	}

	// Otherwise, render with sidebar
	return (
		<PageWithSidebarTemplate
			sidebarProps={{
				data: sidebarData,
				onLogout,
				searchLabel: t("search"),
				searchPlaceholder: t("searchPlaceholder"),
			}}
		>
			{children}
		</PageWithSidebarTemplate>
	);
}
