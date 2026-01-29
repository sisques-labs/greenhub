"use client";

import { SidebarTrigger } from "@/presentation/components/ui/sidebar";
import { useIsMobile } from "@/presentation/hooks/use-mobile";
import { cn } from "@/presentation/lib/utils";
import * as React from "react";

interface DesktopHeaderProps {
	className?: string;
}

/**
 * Desktop header component that displays the sidebar toggle button
 * Only visible on desktop devices
 */
export function DesktopHeader({ className }: DesktopHeaderProps) {
	const isMobile = useIsMobile();

	if (isMobile) {
		return null;
	}

	return (
		<header
			className={cn(
				"sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4 md:flex",
				className,
			)}
		>
			<SidebarTrigger />
		</header>
	);
}



