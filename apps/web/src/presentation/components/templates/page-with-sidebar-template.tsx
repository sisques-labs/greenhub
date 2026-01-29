import {
	AppSidebar,
	AppSidebarProps,
} from "@/ui/composites/app-sidebar";
import { DesktopHeader } from "@/ui/composites/desktop-header";
import { MobileHeader } from "@/ui/composites/mobile-header";
import PageTemplate from "@/presentation/components/templates/page-template";
import {
	SidebarInset,
	SidebarProvider,
} from "@/ui/primitives/sidebar";
import React from "react";

interface PageWithSidebarTemplateProps {
	children: React.ReactNode;
	sidebarProps: AppSidebarProps;
}

const PageWithSidebarTemplate = ({
	sidebarProps,
	children,
}: PageWithSidebarTemplateProps) => {
	return (
		<SidebarProvider>
			<AppSidebar {...sidebarProps} />
			<SidebarInset className="min-w-0 max-w-full">
				<MobileHeader
					appName={sidebarProps.data.header.appName}
					logoSrc={sidebarProps.data.header.logoSrc}
					logoUrl={sidebarProps.data.header.url}
				/>
				<DesktopHeader />
				<PageTemplate>{children}</PageTemplate>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default PageWithSidebarTemplate;
