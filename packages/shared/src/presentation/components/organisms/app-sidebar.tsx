import { SidebarData } from '@repo/shared/domain/interfaces/sidebar-data.interface';
import { SearchForm } from '@repo/shared/presentation/components/organisms/search-form';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@repo/shared/presentation/components/ui/sidebar';
import { LogOut } from 'lucide-react';
import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui';

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  data: SidebarData;
  onLogout?: () => void;
}

export function AppSidebar({ data, onLogout, ...props }: AppSidebarProps) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" variant="outline">
              <a href={data.header.url || '#'}>
                {data.header.logoSrc && (
                  <img
                    src={data.header.logoSrc}
                    alt={data.header.appName}
                    className="h-6 w-6 shrink-0"
                  />
                )}
                <span className="font-semibold">{data.header.appName}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <a href={data.footer.profileUrl}>
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={data.footer.avatarSrc} />
                  <AvatarFallback>{data.footer.avatarFallback}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{data.footer.name}</span>
              </a>
            </SidebarMenuButton>
            {onLogout && (
              <SidebarMenuAction
                onClick={onLogout}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 !top-1/2 !-translate-y-1/2"
              >
                <LogOut className="size-4" />
              </SidebarMenuAction>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
