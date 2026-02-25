import {
	AppSidebar,
	AppSidebarProps,
} from '@/shared/components/organisms/app-sidebar';
import { DesktopHeader } from '@/shared/components/organisms/desktop-header/desktop-header';
import { MobileHeader } from '@/shared/components/organisms/mobile-header/mobile-header';
import PageTemplate from '@/shared/components/templates/page-template';
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar';
import React from 'react';

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
