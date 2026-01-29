"use client";

import { SidebarTrigger } from "@/ui/primitives/sidebar";
import { useIsMobile } from "@/lib/hooks/use-mobile";
import { cn } from "@/lib/utils/cn";
import * as React from "react";

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
export function MobileHeader({
	appName,
	logoSrc,
	logoUrl,
	className,
}: MobileHeaderProps) {
	const isMobile = useIsMobile();

	if (!isMobile) {
		return null;
	}

	return (
		<header
			className={cn(
				"sticky top-0 z-50 flex h-14 items-center border-b bg-background px-4 md:hidden",
				className,
			)}
		>
			<SidebarTrigger />
		</header>
	);
}
