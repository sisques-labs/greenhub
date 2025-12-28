import {
  AppSidebar,
  AppSidebarProps,
} from '@repo/shared/presentation/components/organisms/app-sidebar';
import { MobileHeader } from '@repo/shared/presentation/components/organisms/mobile-header/mobile-header';
import PageTemplate from '@repo/shared/presentation/components/templates/page-template';
import {
  SidebarInset,
  SidebarProvider,
} from '@repo/shared/presentation/components/ui/sidebar';
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
        <PageTemplate>{children}</PageTemplate>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default PageWithSidebarTemplate;
