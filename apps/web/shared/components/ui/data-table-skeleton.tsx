import * as React from 'react';
import { Skeleton } from './skeleton';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from './table';

export interface DataTableSkeletonProps {
	/**
	 * Number of columns to render
	 */
	columns: number;
	/**
	 * Number of rows to render (default: 10)
	 */
	rows?: number;
	/**
	 * Whether to show a selection checkbox column
	 */
	enableRowSelection?: boolean;
}

/**
 * Skeleton component for DataTable loading state
 * @example
 * ```tsx
 * <DataTableSkeleton columns={5} rows={10} />
 * ```
 */
export function DataTableSkeleton({
	columns,
	rows = 10,
	enableRowSelection = false,
}: DataTableSkeletonProps) {
	const effectiveColumns = enableRowSelection ? columns + 1 : columns;

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						{enableRowSelection && (
							<TableHead className="w-12">
								<Skeleton className="h-4 w-4" />
							</TableHead>
						)}
						{Array.from({ length: columns }).map((_, index) => (
							<TableHead key={index}>
								<Skeleton className="h-4 w-24" />
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.from({ length: rows }).map((_, rowIndex) => (
						<TableRow key={rowIndex}>
							{enableRowSelection && (
								<TableCell>
									<Skeleton className="h-4 w-4" />
								</TableCell>
							)}
							{Array.from({ length: columns }).map((_, colIndex) => (
								<TableCell key={colIndex}>
									<Skeleton className="h-4 w-full" />
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
