"use client";

import { cn } from "@/lib/utils/cn";
import * as React from "react";

export interface PageHeaderProps {
	/**
	 * The title of the page
	 */
	title: string;
	/**
	 * Optional description text or components below the title
	 */
	description?: React.ReactNode;
	/**
	 * Array of action buttons or elements to display on the right side
	 */
	actions?: React.ReactNode[];
	/**
	 * Additional className for the container
	 */
	className?: string;
}

/**
 * PageHeader component
 * Displays a page title, optional description, and action buttons
 * Responsive: stacks vertically on mobile, horizontal on desktop
 */
export function PageHeader({
	title,
	description,
	actions = [],
	className,
}: PageHeaderProps) {
	return (
		<div
			className={cn(
				"flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
				className,
			)}
		>
			<div className="flex-1">
				<h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
				{description && (
					<div className="mt-1">
						{typeof description === "string" ? (
							<p className="text-sm text-muted-foreground md:text-base">
								{description}
							</p>
						) : (
							description
						)}
					</div>
				)}
			</div>
			{actions.length > 0 && (
				<div className="flex items-center gap-2 flex-shrink-0">
					{actions.map((action, index) => (
						<React.Fragment key={index}>{action}</React.Fragment>
					))}
				</div>
			)}
		</div>
	);
}
