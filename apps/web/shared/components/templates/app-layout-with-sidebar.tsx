'use client';

import PageWithSidebarTemplate from '@repo/shared/presentation/components/templates/page-with-sidebar-template';
import { useAuthLogout } from 'features/auth/hooks/use-auth-logout/use-auth-logout';
import { useAuthProfileMe } from 'features/auth/hooks/use-auth-profile-me/use-auth-profile-me';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { useAppRoutes } from 'shared/hooks/use-routes';
import { useSidebarUserStore } from 'shared/stores/sidebar-user-store';

interface AppLayoutWithSidebarProps {
	children: React.ReactNode;
}

/**
 * Layout component that wraps pages with sidebar, excluding auth routes
 */
export function AppLayoutWithSidebar({ children }: AppLayoutWithSidebarProps) {
	const pathname = usePathname();
	const { getSidebarData, routes } = useAppRoutes();
	const t = useTranslations('nav');

	// Check if current route is auth (should not show sidebar)
	const isAuthRoute = useMemo(() => {
		return pathname?.includes('/auth') ?? false;
	}, [pathname]);

	// Get sidebar navigation data
	const sidebarNavData = getSidebarData();

	// Initialize profile loading (this will sync to store)
	// Only load profile if not on auth route
	useAuthProfileMe({ enabled: !isAuthRoute });

	// Get user profile from store (for sidebar)
	const profile = useSidebarUserStore((state) => state.profile);

	// Get logout handler
	const { handleLogout } = useAuthLogout();

	// Prepare sidebar data with header and footer
	const sidebarData = useMemo(() => {
		return {
			...sidebarNavData,
			header: {
				appName: process.env.NEXT_PUBLIC_APP_NAME || 'App Name',
				logoSrc: '/favicon.ico',
				url: routes.home,
			},
			footer: {
				avatarSrc: profile?.avatarUrl || undefined,
				avatarFallback:
					profile?.name?.charAt(0) || profile?.userName?.charAt(0) || 'U',
				name: profile?.name || profile?.userName || 'User',
				profileUrl: routes.userProfile,
			},
		};
	}, [sidebarNavData, profile, routes]);

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
				searchLabel: t('search'),
				searchPlaceholder: t('searchPlaceholder'),
			}}
		>
			{children}
		</PageWithSidebarTemplate>
	);
}
