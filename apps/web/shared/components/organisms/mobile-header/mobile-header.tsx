'use client';

import { SidebarTrigger } from '@/shared/components/ui/sidebar';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { cn } from '@/shared/lib/utils';

interface MobileHeaderProps {
	appName?: string;
	logoSrc?: string;
	logoUrl?: string;
	className?: string;
}

/**
 * Mobile header component that displays hamburger menu
 * Only visible on mobile devices
 */
export function MobileHeader({ className }: MobileHeaderProps) {
	const isMobile = useIsMobile();

	if (!isMobile) {
		return null;
	}

	return (
		<header
			className={cn(
				'sticky top-0 z-50 flex h-14 items-center border-b bg-background px-4 md:hidden',
				className,
			)}
		>
			<SidebarTrigger />
		</header>
	);
}
