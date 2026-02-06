'use client';

import { Skeleton } from '@/shared/components/ui/skeleton';

interface PageSkeletonProps {
	showSearchAndFilters?: boolean;
	showPagination?: boolean;
	className?: string;
}

/**
 * Reusable skeleton for page header (title, description, action button)
 */
export function PageHeaderSkeleton() {
	return (
		<div className="flex items-center justify-between">
			<div>
				<Skeleton className="h-9 w-48" />
				<Skeleton className="h-4 w-96 mt-1" />
			</div>
			<Skeleton className="h-10 w-32" />
		</div>
	);
}

/**
 * Reusable skeleton for search and filters section
 */
export function SearchAndFiltersSkeleton() {
	return (
		<div className="flex gap-4 items-center flex-wrap">
			<Skeleton className="h-10 flex-1 min-w-[300px]" />
			<div className="flex gap-2">
				<Skeleton className="h-9 w-20" />
				<Skeleton className="h-9 w-24" />
				<Skeleton className="h-9 w-24" />
				<Skeleton className="h-9 w-24" />
			</div>
		</div>
	);
}

/**
 * Reusable skeleton for pagination section
 */
export function PaginationSkeleton() {
	return (
		<div className="flex items-center justify-between">
			<Skeleton className="h-4 w-48" />
			<div className="flex gap-2">
				<Skeleton className="h-9 w-9" />
				<Skeleton className="h-9 w-9" />
				<Skeleton className="h-9 w-9" />
				<Skeleton className="h-9 w-9" />
				<Skeleton className="h-9 w-9" />
			</div>
		</div>
	);
}

/**
 * Complete page skeleton with header, search/filters, and optional pagination
 */
export function PageSkeleton({
	showSearchAndFilters = true,
	showPagination = false,
	className,
}: PageSkeletonProps) {
	return (
		<div className={`mx-auto space-y-6 ${className || ''}`}>
			<PageHeaderSkeleton />
			{showSearchAndFilters && <SearchAndFiltersSkeleton />}
			{showPagination && <PaginationSkeleton />}
		</div>
	);
}
