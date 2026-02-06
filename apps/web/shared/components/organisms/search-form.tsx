'use client';

import { Label } from '@/shared/components/ui/label';
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarInput,
} from '@/shared/components/ui/sidebar';
import { Search } from 'lucide-react';
import * as React from 'react';

export interface SearchFormProps extends React.ComponentProps<'form'> {
	/**
	 * The label text for the search input (for screen readers)
	 */
	searchLabel?: string;
	/**
	 * The placeholder text for the search input
	 */
	searchPlaceholder?: string;
}

export function SearchForm({
	className,
	searchLabel = 'Search',
	searchPlaceholder = 'Search...',
	...props
}: SearchFormProps) {
	return (
		<form className={className} {...props}>
			<SidebarGroup className="py-0 px-0">
				<SidebarGroupContent className="relative w-full">
					<Label htmlFor="search" className="sr-only">
						{searchLabel}
					</Label>
					<SidebarInput
						id="search"
						placeholder={searchPlaceholder}
						className="pl-8 w-full h-8"
					/>
					<Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 opacity-50 select-none" />
				</SidebarGroupContent>
			</SidebarGroup>
		</form>
	);
}
