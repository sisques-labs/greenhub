import { SearchForm } from '@/shared/components/organisms/search-form';
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
} from '@/shared/components/ui/sidebar';
import { SidebarData } from '@/shared/interfaces/sidebar-data.interface';
import {
	Home,
	LayoutGrid,
	LogOut,
	MapPin,
	Settings,
	Sprout,
} from 'lucide-react';
import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui';

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	data: SidebarData;
	onLogout?: () => void;
	/**
	 * The label text for the search input (for screen readers)
	 */
	searchLabel?: string;
	/**
	 * The placeholder text for the search input
	 */
	searchPlaceholder?: string;
}

// Icon mapping for navigation items
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
	home: Home,
	plants: Sprout,
	growingUnits: LayoutGrid,
	locations: MapPin,
	settings: Settings,
};

export function AppSidebar({
	data,
	onLogout,
	searchLabel,
	searchPlaceholder,
	...props
}: AppSidebarProps) {
	return (
		<Sidebar
			{...props}
			variant="sidebar"
			className="border-r border-sidebar-border/50"
		>
			<SidebarHeader className="border-b border-sidebar-border/50 bg-gradient-to-b from-sidebar/50 to-sidebar/30 backdrop-blur-sm">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild size="lg" className="gap-3">
							<a href={data.header.url || '#'}>
								{data.header.logoSrc && (
									<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/20">
										<img
											src={data.header.logoSrc}
											alt={data.header.appName}
											className="h-5 w-5"
										/>
									</div>
								)}
								<div className="flex flex-col items-start gap-0.5">
									<span className="font-bold text-base leading-none">
										{data.header.appName}
									</span>
									<span className="text-xs text-sidebar-foreground/60 font-normal">
										Dashboard
									</span>
								</div>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
				<div className="px-2 pb-2">
					<SearchForm
						searchLabel={searchLabel}
						searchPlaceholder={searchPlaceholder}
					/>
				</div>
			</SidebarHeader>
			<SidebarContent className="gap-1">
				{/* We create a SidebarGroup for each parent. */}
				{data.navMain.map((group) => (
					<SidebarGroup key={group.title} className="px-2">
						<SidebarGroupLabel className="px-3 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
							{group.title}
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{group.items.map((item) => {
									const IconComponent =
										item.icon || iconMap[item.title.toLowerCase()];
									return (
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton
												asChild
												isActive={item.isActive}
												className="group relative gap-3 transition-all duration-200 hover:translate-x-0.5 data-[active=true]:bg-sidebar-accent data-[active=true]:shadow-sm data-[active=true]:shadow-sidebar-accent/20"
											>
												<a href={item.url} className="flex items-center gap-3">
													{IconComponent && (
														<IconComponent className="size-4 shrink-0 transition-transform group-hover:scale-110 group-data-[active=true]/menu-button:text-sidebar-accent-foreground" />
													)}
													<span className="font-medium">{item.title}</span>
													{item.isActive && (
														<div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary transition-all" />
													)}
												</a>
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
			<SidebarFooter className="border-t border-sidebar-border/50 bg-gradient-to-t from-sidebar/50 to-sidebar/30 backdrop-blur-sm">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							size="lg"
							className="gap-3 hover:bg-sidebar-accent/50"
						>
							<a
								href={data.footer.profileUrl}
								className="flex items-center gap-3"
							>
								<Avatar className="h-9 w-9 shrink-0 ring-2 ring-sidebar-border/50 transition-all hover:ring-primary/30">
									<AvatarImage src={data.footer.avatarSrc} />
									<AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 font-semibold">
										{data.footer.avatarFallback}
									</AvatarFallback>
								</Avatar>
								<div className="flex flex-col items-start gap-0.5 min-w-0 flex-1">
									<span className="font-semibold text-sm truncate w-full">
										{data.footer.name}
									</span>
									<span className="text-xs text-sidebar-foreground/60 truncate w-full">
										View profile
									</span>
								</div>
							</a>
						</SidebarMenuButton>
						{onLogout && (
							<SidebarMenuAction
								onClick={onLogout}
								className="text-destructive hover:text-destructive hover:bg-destructive/10 !top-1/2 !-translate-y-1/2 transition-all hover:scale-110"
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
