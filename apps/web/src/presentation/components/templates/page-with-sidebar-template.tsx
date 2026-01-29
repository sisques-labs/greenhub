import {
	AppSidebar,
	AppSidebarProps,
} from "@/presentation/components/organisms/app-sidebar";
import { DesktopHeader } from "@/presentation/components/organisms/desktop-header/desktop-header";
import { MobileHeader } from "@/presentation/components/organisms/mobile-header/mobile-header";
import PageTemplate from "@/presentation/components/templates/page-template";
import {
	SidebarInset,
	SidebarProvider,
} from "@/presentation/components/ui/sidebar";
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
